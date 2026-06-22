"use client";

import { useEffect, useState } from "react";

type Key = {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
};

export default function ApiKeyCard() {
  const [keys, setKeys] = useState<Key[] | null>(null);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { keys: Key[] };
      setKeys(data.keys);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    setCopied(false);
    try {
      const res = await fetch("/api/keys", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { key: string };
      setRevealed(data.key);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  }

  async function handleCopy() {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const activeKey = keys?.[0];
  const display = revealed ?? activeKey?.prefix ?? "—";

  return (
    <section className="card p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">API Key</h3>
        <p className="mt-0.5 text-xs text-muted-soft">
          Your API key for using Agezero Connect services. Use this key with the{" "}
          <a className="underline hover:text-white" href="/api-gateway">
            API Gateway
          </a>{" "}
          skill.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={display}
          className="input flex-1 font-mono text-xs"
          aria-label="API key"
        />
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setRevealed((v) => (v ? null : v))}
          aria-label="Show / hide"
          title="Show / hide"
          disabled={!activeKey && !revealed}
        >
          👁
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={handleCopy}
          disabled={!revealed}
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="btn-ghost"
        >
          {creating ? "…" : "↺ Reset"}
        </button>
      </div>

      {error ? (
        <p className="mt-2 text-xs text-rose-400">{error}</p>
      ) : null}
      {!activeKey && !revealed ? (
        <p className="mt-2 text-[11px] text-muted">
          No key yet — click <strong>Reset</strong> to generate one.
        </p>
      ) : null}
      {revealed ? (
        <p className="mt-2 text-[11px] text-amber-300">
          ⚠ Copy now — this is the only time the full key will be shown.
        </p>
      ) : null}
    </section>
  );
}