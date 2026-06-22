"use client";

import { useEffect, useState } from "react";
import type { AppEntry } from "@/lib/catalog";
import { getNangoClient, hasNangoPublicKey } from "@/lib/nango-client";
import AppIcon from "@/components/AppIcon";

type Conn = {
  id: string;
  connection_id: string;
  provider_config_key: string;
  created: string;
};

export default function AppCard({ app }: { app: AppEntry }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conns, setConns] = useState<Conn[]>([]);
  const ready = hasNangoPublicKey();

  async function refresh() {
    try {
      const res = await fetch("/api/nango/connections", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { connections: Conn[] };
      setConns(data.connections ?? []);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const linked = conns.filter((c) => c.provider_config_key === app.id);

  async function handleConnect() {
    setError(null);
    const nango = getNangoClient();
    if (!nango) {
      setError(
        "NEXT_PUBLIC_NANGO_PUBLIC_KEY is not set — configure Nango to enable live connects.",
      );
      return;
    }
    setConnecting(true);
    try {
      const connectionId =
        process.env.NEXT_PUBLIC_NANGO_DEFAULT_CONNECTION_ID || "demo-user";
      const result = await nango.auth(app.id, connectionId, {
        detectClosedAuthWindow: true,
      });
      if (result) {
        await refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="card card-hover p-4">
      <div className="flex items-start gap-3">
        <AppIcon glyph={app.icon} bg={app.iconBg} className="h-10 w-10 text-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold tracking-tight">
              {app.name}
            </h3>
            {linked.length > 0 ? (
              <span className="pill-ok">
                <span className="h-1.5 w-1.5 rounded-full bg-green-ok" />
                Connected
              </span>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                disabled={!ready || connecting}
                className="btn-ghost"
                title={
                  ready
                    ? "Connect via Nango"
                    : "Set NEXT_PUBLIC_NANGO_PUBLIC_KEY to enable"
                }
              >
                {connecting ? "Connecting…" : "+ Connect"}
              </button>
            )}
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs text-muted-soft">
            {app.description}
          </p>
          {error ? (
            <p className="mt-2 text-[11px] text-rose-400">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}