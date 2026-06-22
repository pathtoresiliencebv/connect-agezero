"use client";

import { useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  LayoutTemplate,
  Sparkles,
  Zap,
  Wrench,
  Plug,
  Terminal,
  Cable,
  Home,
  ArrowUpRight,
  ChevronDown,
  Palette,
  TrendingUp,
  Boxes,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type Toolkit = {
  label: string;
  href: string;
  blurb: string;
  icon: LucideIcon;
  /** Tailwind class for the icon's accent color */
  accent: string;
};

type Category = {
  title: string;
  description: string;
  /** Lucide icon for the category badge */
  icon: LucideIcon;
  iconAccent: string;
  tools: Toolkit[];
};

const CATEGORIES: Category[] = [
  {
    title: "UI / UX",
    description: "Design, generate, ship",
    icon: Palette,
    iconAccent: "from-fuchsia-500/30 to-violet-500/20 text-fuchsia-300",
    tools: [
      {
        label: "UI",
        href: "https://ui.agezero.io",
        blurb: "Component library",
        icon: LayoutGrid,
        accent: "text-fuchsia-300",
      },
      {
        label: "Templates",
        href: "https://templates.agezero.io",
        blurb: "Ready-to-ship starters",
        icon: LayoutTemplate,
        accent: "text-violet-300",
      },
      {
        label: "Magic",
        href: "https://magic.agezero.io",
        blurb: "Generate from intent",
        icon: Sparkles,
        accent: "text-pink-300",
      },
    ],
  },
  {
    title: "AI Agents",
    description: "Skills, tools, growth",
    icon: Workflow,
    iconAccent: "from-cyan-500/30 to-blue-500/20 text-cyan-300",
    tools: [
      {
        label: "Skills",
        href: "https://skills.agezero.io",
        blurb: "Reusable agent skills",
        icon: Zap,
        accent: "text-cyan-300",
      },
      {
        label: "Tools",
        href: "https://tools.agezero.io",
        blurb: "Tool registry",
        icon: Wrench,
        accent: "text-sky-300",
      },
      {
        label: "SEO",
        href: "https://seo.agezero.io",
        blurb: "Programmatic SEO",
        icon: TrendingUp,
        accent: "text-emerald-300",
      },
    ],
  },
  {
    title: "Operating system",
    description: "Connect, run, manage",
    icon: Boxes,
    iconAccent: "from-amber-500/30 to-orange-500/20 text-amber-300",
    tools: [
      {
        label: "MCP",
        href: "https://mcp.agezero.io",
        blurb: "Model Context Protocol",
        icon: Plug,
        accent: "text-amber-300",
      },
      {
        label: "CLI",
        href: "https://cli.agezero.io",
        blurb: "Terminal-first workflows",
        icon: Terminal,
        accent: "text-orange-300",
      },
      {
        label: "Connect",
        href: "https://connect.agezero.io",
        blurb: "Integrations gateway",
        icon: Cable,
        accent: "text-rose-300",
      },
    ],
  },
];

const HOME_LINK = {
  label: "agezero.nl",
  href: "https://agezero.nl",
  blurb: "Home base",
};

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
        <Boxes className="h-3.5 w-3.5" />
        <span>{buttonLabel}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-2 w-[min(760px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-ink-900/95 shadow-2xl backdrop-blur ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="grid gap-0 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="border-b border-line p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${cat.iconAccent}`}
                      aria-hidden
                    >
                      <CatIcon className="h-4 w-4" />
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
                  <ul className="space-y-0.5">
                    {cat.tools.map((t) => {
                      const Icon = t.icon;
                      return (
                        <li key={t.href}>
                          <a
                            href={t.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-start gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                          >
                            <span
                              className={`mt-0.5 ${t.accent} opacity-70 transition-opacity group-hover:opacity-100`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium text-muted-soft group-hover:text-white">
                                {t.label}
                              </span>
                              <span className="block truncate text-[10px] text-muted">
                                {t.blurb}
                              </span>
                            </span>
                            <ArrowUpRight className="mt-0.5 h-3 w-3 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="border-t border-line bg-ink-950/40 px-4 py-3">
            <a
              href={HOME_LINK.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-soft">
                  <Home className="h-4 w-4" />
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
              <span className="inline-flex items-center gap-1 text-[11px] text-muted group-hover:text-white">
                Visit
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
