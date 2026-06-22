export default function UsagePage() {
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="text-sm font-semibold">API usage</h3>
        <p className="mt-1 text-xs text-muted-soft">
          Usage metrics appear here once you start making calls through the
          gateway.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { label: "Requests (24h)", value: "0" },
          { label: "Active connections", value: "0" },
          { label: "Errors (24h)", value: "0" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted">
              {s.label}
            </div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card flex h-64 items-center justify-center text-xs text-muted">
        Usage chart placeholder
      </div>
    </div>
  );
}