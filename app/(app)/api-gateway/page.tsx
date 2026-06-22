export default function ApiGatewayPage() {
  const examples = [
    {
      title: "Send a Slack message",
      code: `curl -X POST 'https://api.agezero.app/v1/proxy' \\
  -H "Authorization: Bearer $AGZERO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "slack",
    "connectionId": "demo-user",
    "method": "POST",
    "endpoint": "/chat.postMessage",
    "data": { "channel": "C0123", "text": "Hello!" }
  }'`,
    },
    {
      title: "List Notion pages",
      code: `curl -X POST 'https://api.agezero.app/v1/proxy' \\
  -H "Authorization: Bearer $AGZERO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "notion",
    "connectionId": "demo-user",
    "method": "GET",
    "endpoint": "/v1/users/me"
  }'`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="text-sm font-semibold">API Gateway</h3>
        <p className="mt-1 text-sm text-muted-soft">
          One endpoint, every connected app. The gateway uses the same
          pattern as the Maton gateway:{" "}
          <span className="kbd">/v1/proxy</span> with your provider, connection
          id, method and endpoint. Nango handles the credentials.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
          <div className="card p-3">
            <div className="text-muted">Auth</div>
            <div className="font-mono">Bearer &lt;AGZERO_API_KEY&gt;</div>
          </div>
          <div className="card p-3">
            <div className="text-muted">Methods</div>
            <div className="font-mono">GET · POST · PUT · PATCH · DELETE</div>
          </div>
          <div className="card p-3">
            <div className="text-muted">Backed by</div>
            <div className="font-mono">Nango</div>
          </div>
        </div>
      </div>

      {examples.map((e) => (
        <div key={e.title} className="card p-5">
          <div className="mb-2 text-sm font-semibold">{e.title}</div>
          <pre className="overflow-auto rounded-md border border-line bg-ink-900/70 p-3 font-mono text-[11px] leading-relaxed text-muted-soft">
{e.code}
          </pre>
        </div>
      ))}

      <div className="card p-5 text-xs text-muted-soft">
        Tip: the same shape works with the Maton agent toolkit — pass
        <span className="kbd"> --api-key=$AGZERO_API_KEY</span> and you can
        drive any of these from Claude Code, Codex or OpenCode.
      </div>
    </div>
  );
}