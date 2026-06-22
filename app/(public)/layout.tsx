import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Authenticated users skip the marketing surface and land on the dashboard.
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/home");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 to-violet-500 text-xs font-black text-white">
              A
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Agezero Connect
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <a
              href="#features"
              className="hidden text-muted-soft hover:text-white sm:inline-flex"
            >
              Features
            </a>
            <a
              href="#how"
              className="hidden text-muted-soft hover:text-white sm:inline-flex"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="hidden text-muted-soft hover:text-white sm:inline-flex"
            >
              FAQ
            </a>
            <Link
              href="/login"
              className="rounded-md border border-line bg-white/[0.04] px-3 py-1.5 text-muted-soft transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted sm:flex-row">
          <div>© Agezero Connect</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white">
              Sign in
            </Link>
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
