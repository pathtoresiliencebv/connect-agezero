"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const platform = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/connections", label: "Connections", icon: "≣" },
  { href: "/tasks", label: "Tasks", icon: "✦", badge: true },
  { href: "/usage", label: "Usage", icon: "▥" },
];

const resources = [
  { href: "/api-gateway", label: "API Gateway", icon: "%" },
  { href: "/trust-center", label: "Trust Center", icon: "◆" },
];

function NavLink({
  href,
  label,
  icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  badge?: boolean;
}) {
  return (
    <Link
      href={href}
      className={active ? "nav-item-active" : "nav-item"}
      aria-current={active ? "page" : undefined}
    >
      <span className="w-4 text-center text-base leading-none">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-label="New" />
      ) : null}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const userEmail = session?.user?.email ?? "you@example.com";
  const userInitial = (session?.user?.name ?? userEmail)
    .slice(0, 1)
    .toUpperCase();
  const userName = session?.user?.name || userEmail.split("@")[0];

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-ink-900/60 px-3 py-4 md:flex">
      <Link
        href="/"
        className="mb-1 flex items-center gap-2 rounded-md px-2 py-1.5"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 to-violet-500 text-xs font-black text-white">
          A
        </div>
        <div className="text-sm font-semibold tracking-tight">
          Agezero Connect
        </div>
      </Link>

      <div className="nav-section">Platform</div>
      <nav className="flex flex-col gap-0.5">
        {platform.map((it) => (
          <NavLink
            key={it.href}
            href={it.href}
            label={it.label}
            icon={it.icon}
            active={isActive(it.href)}
            badge={it.badge}
          />
        ))}
      </nav>

      <div className="nav-section">Resources</div>
      <nav className="flex flex-col gap-0.5">
        {resources.map((it) => (
          <NavLink
            key={it.href}
            href={it.href}
            label={it.label}
            icon={it.icon}
            active={isActive(it.href)}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="card p-3 text-xs">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-orange-500 to-rose-500 text-[10px] font-black text-white">
              ✶
            </span>
            <span className="text-sm font-semibold">Tasks</span>
            <button
              type="button"
              className="ml-auto text-muted hover:text-white"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
          <p className="text-muted-soft">
            Delegate tasks across your apps to Claude Code, Codex, or OpenCode.
          </p>
          <Link href="/tasks" className="btn-soft mt-3 w-full">
            Continue
          </Link>
        </div>

        <div className="flex items-center gap-2 rounded-md px-1 py-1.5">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-semibold text-white">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">{userEmail}</div>
            <div className="truncate text-[11px] text-muted">
              Signed in as {userName}
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-muted hover:text-white"
            aria-label="Sign out"
            title="Sign out"
          >
            ⋮
          </button>
        </div>
      </div>
    </aside>
  );
}