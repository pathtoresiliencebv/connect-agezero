export default function TrustCenterPage() {
  const items = [
    {
      title: "Data handling",
      body: "We never persist the bodies of API calls made through the gateway beyond what's needed to surface errors to you. Credentials live in Nango with per-tenant isolation.",
    },
    {
      title: "Encryption",
      body: "TLS 1.2+ in transit. Credentials encrypted at rest by Nango. Our servers run on Vercel with VPC isolation.",
    },
    {
      title: "Auth",
      body: "NextAuth.js with email + password. Sessions are JWT-signed with NEXTAUTH_SECRET. API keys are SHA-256 hashed; we only ever show the plaintext once at creation.",
    },
    {
      title: "Compliance",
      body: "GDPR-aware. Data Processing Addendum available on request.",
    },
  ];
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.title} className="card p-5">
          <h3 className="text-sm font-semibold">{i.title}</h3>
          <p className="mt-1 text-xs text-muted-soft">{i.body}</p>
        </div>
      ))}
    </div>
  );
}