"use client";

import { useEffect, useRef, useState } from "react";

type Toolkit = {
  label: string;
  href: string;
  blurb: string;
  icon: string;
};

type Category = {
  title: string;
  description: string;
  icon: string;
  tools: Toolkit[];
};

const CATEGORIES: Category[] = [
  {
    title: "UI / UX",
    description: "Design, generate, ship",
    icon: "🎨",
    tools: [
      {
        label: "UI",
        href: "https://ui.agezero.io",
        blurb: "Component library",
        icon: "◆",
      },
      {
        label: "Templates",
        href: "https://templates.agezero.io",
        blurb: "Ready-to-ship starters",
        icon: "▤",
      },
      {
        label: "Magic",
        href: "https://magic.agezero.io",
        blurb: "Generate from intent",
        icon: "✦",
      },
    ],
  },
  {
    title: "AI Agents",
    description: "Skills, tools, growth",
    icon: "🧠",
    tools: [
      {
        label: "Skills",
        href: "https://skills.agezero.io",
        blurb: "Reusable agent skills",
        icon: "⚡",
      },
      {
        label: "Tools",
        href: "https://tools.agezero.io",
        blurb: "Tool registry",
        icon: "✺",
      },
      {
        label: "SEO",
        href: "https://seo.agezero.io",
        blurb: "Programmatic SEO",
        icon: "⌖",
      },
    ],
  },
  {
    title: "Operating system",
    description: "Connect, run, manage",
    icon: "⌬",
    tools: [
      {
        label: "MCP",
        href: "https://mcp.agezero.io",
        blurb: "Model Context Protocol",
        icon: "◇",
      },
      {
        label: "CLI",
        href: "https://cli.agezero.io",
        blurb: "Terminal-first workflows",
        icon: "$",
      },
      {
        label: "Connect",
        href: "https://connect.agezero.io",
        blurb: "Integrations gateway",
        icon: "↔",
      },
    ],
  },
];

const HOME_LINK = { label: "agezero.nl", href: "https://agezero.nl", blurb: "Home base" };

export default function MegaMenu({
  align = "right",
  buttonLabel = "Toolkits",
}: {
  align?: "left" | "right";
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-muted-soft transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <span>{buttonLabel}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 4l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-2 w-[min(720px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-ink-900/95 shadow-2xl backdrop-blur ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="grid gap-0 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="border-b border-line p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 text-base"
                    aria-hidden
                  >
                    {cat.icon}
                  </span>
                  <div className="leading-tight">
                    <div className="text-xs font-semibold text-white">
                      {cat.title}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted">
                      {cat.description}
                    </div>
                  </div>
                </div>
                <ul className="space-y-1">
                  {cat.tools.map((t) => (
                    <li key={t.href}>
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="mt-0.5 text-muted-soft group-hover:text-white">
                          {t.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium text-muted-soft group-hover:text-white">
                            {t.label}
                          </span>
                          <span className="block truncate text-[10px] text-muted">
                            {t.blurb}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-line bg-ink-950/40 px-4 py-3">
            <a
              href={HOME_LINK.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-orange-500 to-rose-500 text-xs font-bold text-white">
                  A
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-white">
                    {HOME_LINK.label}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">
                    {HOME_LINK.blurb}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-muted group-hover:text-white">
                Visit ↗
              </span>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
