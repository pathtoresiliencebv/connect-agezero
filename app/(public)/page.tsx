import Link from "next/link";

const features = [
  {
    icon: "🗂️",
    title: "24 apps, one inbox",
    body: "Gmail, Slack, Notion, HubSpot, Stripe, GitHub, OpenAI, Anthropic — connected once, called anywhere.",
  },
  {
    icon: "🔌",
    title: "Managed auth, zero plumbing",
    body: "OAuth, API keys, token refresh and storage are all handled by Nango. You ship features, not credential code.",
  },
  {
    icon: "🧠",
    title: "Drives any agent",
    body: "Same endpoint pattern as the Maton gateway — works with Claude Code, Codex, OpenCode, or your own scripts.",
  },
  {
    icon: "🪪",
    title: "Per-tenant API keys",
    body: "Each user gets their own bearer token. Mint, copy, reset, done. The plaintext is shown exactly once.",
  },
  {
    icon: "📋",
    title: "Connections table",
    body: "See every tenant's connection at a glance — app, account, method, status, created. Filter, paginate, audit.",
  },
  {
    icon: "🔒",
    title: "Auth-gated by default",
    body: "NextAuth credentials with bcrypt. JWT sessions. Every API route checks the session before doing anything.",
  },
];

const steps = [
  {
    n: 1,
    title: "Sign in",
    body: "Use the seed account from your env, or wire a real provider (Google, GitHub) in lib/auth.ts.",
  },
  {
    n: 2,
    title: "Connect an app",
    body: "Hit + Connect on any provider. Nango opens its managed OAuth/API-key flow in a popup.",
  },
  {
    n: 3,
    title: "Call via the gateway",
    body: "POST to /api/nango/proxy from your own code, or use the in-app Playground to test endpoints live.",
  },
  {
    n: 4,
    title: "Drive any agent",
    body: "Pass your API key to the Maton agent toolkit or any MCP-compatible client. Same gateway, same shape.",
  },
];

const faqs = [
  {
    q: "Is this the same as Maton?",
    a: "Same UX patterns (sidebar + integrations grid + connections table + tasks) and same gateway shape, but you own the deployment. The backend is Nango instead of Maton's managed layer.",
  },
  {
    q: "Can I deploy on Vercel?",
    a: "Yes — that's the default. Push to GitHub, import on Vercel, set NEXTAUTH_SECRET + seed user env vars, deploy. The full README walks through it.",
  },
  {
    q: "Why is the file store not persistent on Vercel?",
    a: "Serverless functions have a read-only filesystem. The auth flow falls back to an env-only seed user so the demo keeps working. For production persistence, swap lib/users.ts and lib/tasks-store.ts for Vercel KV or Postgres — the public function signatures stay the same.",
  },
  {
    q: "How do I add a new provider?",
    a: "Edit lib/catalog.ts and add an entry with a Nango provider slug, then register the integration in your Nango dashboard. The UI updates automatically.",
  },
];

export default function LandingPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.18),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:32px_32px] opacity-30" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <span className="pill mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-ok" />
            One UI for your skills and your integrations
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Your agents,{" "}
            <span className="bg-gradient-to-br from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              every app you use
            </span>
            , one gateway.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-soft sm:text-lg">
            Agezero Connect is the dashboard for AI-powered integrations.
            Connect Gmail, Slack, HubSpot, Stripe and 20+ more apps in seconds,
            then drive them from Claude Code, Codex, or any HTTP client — with
            managed auth and per-tenant API keys.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="btn-primary">
              Sign in →
            </Link>
            <a href="#how" className="btn-ghost">
              How it works
            </a>
          </div>
          <div className="mt-12">
            <div className="card mx-auto max-w-3xl overflow-hidden p-0">
              <div className="flex items-center gap-1.5 border-b border-line bg-ink-900/80 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-ok/70" />
                <span className="ml-3 font-mono text-[11px] text-muted">
                  curl -X POST https://connect.agezero.io/{`{service}`}/api/{`{endpoint}`}
                </span>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-muted-soft">
{`{
  "providerConfigKey": "slack",
  "connectionId":      "demo-user",
  "method":            "POST",
  "endpoint":          "/chat.postMessage",
  "data":              { "channel": "C0123", "text": "Hello from Agezero" }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 text-center">
            <span className="label">Features</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to run an integration tier.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="card p-5 transition-colors hover:border-line-strong"
              >
                <div className="mb-3 text-2xl">{f.icon}</div>
                <div className="text-sm font-semibold">{f.title}</div>
                <p className="mt-1.5 text-xs text-muted-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-10 text-center">
            <span className="label">How it works</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              From sign-in to first call in under a minute.
            </h2>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {steps.map((s) => (
              <li key={s.n} className="card p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-500 text-xs font-bold text-white">
                  {s.n}
                </div>
                <div className="text-sm font-semibold">{s.title}</div>
                <p className="mt-1.5 text-xs text-muted-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-10 text-center">
            <span className="label">FAQ</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                  <span>{f.q}</span>
                  <span className="text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to ship?
          </h2>
          <p className="mt-3 text-sm text-muted-soft">
            Sign in with the demo account and try the playground. Or fork the
            repo, plug in your Nango keys, and deploy to your own Vercel.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-primary">
              Create free account →
            </Link>
            <Link href="/login" className="btn-ghost">
              Sign in
            </Link>
            <a
              href="https://github.com/pathtoresiliencebv/connect-agezero"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
