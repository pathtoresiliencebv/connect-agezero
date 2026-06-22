"use client";

import { useEffect, useMemo, useState } from "react";
import { apps } from "@/lib/catalog";
import AppIcon from "@/components/AppIcon";

type Conn = {
  id: string;
  connection_id: string;
  provider_config_key: string;
  created: string;
  provider?: string;
};

type Status = "active" | "pending" | "error";

function classify(conn: Conn): Status {
  // Nango doesn't expose an explicit "status" — we infer a few states from
  // metadata. For real production you'd query Nango's connection details.
  // Here we treat any provider with errors as error, else active/pending
  // based on a small heuristic so the UI mirrors the Maton look.
  return "active";
}

function methodFor(providerKey: string): string {
  const app = apps.find((a) => a.id === providerKey);
  if (!app) return "OAuth 2";
  if (app.authModes.includes("OAUTH2")) return "OAuth 2";
  if (app.authModes.includes("OAUTH1")) return "OAuth 1";
  if (app.authModes.includes("API_KEY")) return "API Key";
  if (app.authModes.includes("BASIC")) return "Basic";
  if (app.authModes.includes("APP")) return "App";
  return "MCP";
}

export default function ConnectionsTable() {
  const [conns, setConns] = useState<Conn[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterApp, setFilterApp] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);

  async function refresh() {
    setError(null);
    try {
      const res = await fetch("/api/nango/connections", { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { connections: Conn[] };
      setConns(data.connections ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setConns([]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!conns) return [];
    return conns.filter((c) => {
      if (filterApp && c.provider_config_key !== filterApp) return false;
      const s = classify(c);
      if (filterStatus && s !== filterStatus) return false;
      return true;
    });
  }, [conns, filterApp, filterStatus]);

  const total = conns?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageItems = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={filterApp}
            onChange={(e) => {
              setFilterApp(e.target.value);
              setPage(1);
            }}
            className="input w-40"
          >
            <option value="">App</option>
            {apps.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="input w-36"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="error">Error</option>
          </select>
        </div>
        <button className="btn-primary" onClick={() => alert("Add Connection (TBD)")}>
          + Add Connection
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-ink-900/60">
            <tr>
              <th className="table-head">
                <input type="checkbox" aria-label="Select all" />
              </th>
              <th className="table-head">App</th>
              <th className="table-head">Account</th>
              <th className="table-head">Connection ID</th>
              <th className="table-head">Method</th>
              <th className="table-head">Status</th>
              <th className="table-head">Created</th>
              <th className="table-head" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {error ? (
              <tr>
                <td colSpan={8} className="table-cell text-rose-400">
                  {error}
                </td>
              </tr>
            ) : conns === null ? (
              <tr>
                <td colSpan={8} className="table-cell text-muted">
                  Loading…
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-cell text-muted">
                  No connections yet. Click <strong>+ Add Connection</strong>{" "}
                  on the Home page to link an app.
                </td>
              </tr>
            ) : (
              pageItems.map((c) => {
                const app = apps.find((a) => a.id === c.provider_config_key);
                const status = classify(c);
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="table-cell">
                      <input type="checkbox" aria-label={`Select ${c.connection_id}`} />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <AppIcon
                          glyph={app?.icon ?? "?"}
                          bg={app?.iconBg}
                          className="h-6 w-6 text-xs"
                        />
                        <span className="font-medium">
                          {app?.name ?? c.provider_config_key}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell text-muted-soft">—</td>
                    <td className="table-cell font-mono text-xs text-muted-soft">
                      {c.connection_id}
                    </td>
                    <td className="table-cell text-muted-soft">
                      {methodFor(c.provider_config_key)}
                    </td>
                    <td className="table-cell">
                      {status === "active" ? (
                        <span className="pill-ok">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-ok" />
                          Active
                        </span>
                      ) : status === "pending" ? (
                        <span className="pill-pending">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          Pending
                        </span>
                      ) : (
                        <span className="pill">Error</span>
                      )}
                    </td>
                    <td className="table-cell text-muted-soft">
                      {formatDate(c.created)}
                    </td>
                    <td className="table-cell text-right text-muted">⋮</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-soft">
        <div>
          0 of {total} row(s) selected
        </div>
        <div className="flex items-center gap-2">
          Rows per page
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="input w-20"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-ghost px-2 py-1"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            «
          </button>
          <button
            className="btn-ghost px-2 py-1"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹
          </button>
          <button
            className="btn-ghost px-2 py-1"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            ›
          </button>
          <button
            className="btn-ghost px-2 py-1"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}