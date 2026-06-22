"use client";

import { usePathname } from "next/navigation";

const titleByPath: Record<string, { title: string }> = {
  "/": { title: "Home" },
  "/connections": { title: "Connections" },
  "/tasks": { title: "Tasks" },
  "/usage": { title: "Usage" },
  "/api-gateway": { title: "API Gateway" },
  "/trust-center": { title: "Trust Center" },
};

export default function Topbar() {
  const pathname = usePathname();
  const meta =
    Object.entries(titleByPath).find(([p]) =>
      p === "/" ? pathname === "/" : pathname.startsWith(p),
    )?.[1] ?? { title: "Agezero Connect" };

  return (
    <header className="sticky top-0 z-10 -mx-4 mb-6 flex items-center justify-between border-b border-line bg-ink-900/80 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      <div className="text-sm font-semibold tracking-tight">{meta.title}</div>
      <div className="flex items-center gap-3 text-xs text-muted-soft">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white"
        >
          ⌨ Feedback
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white"
        >
          ◌ Community
        </a>
      </div>
    </header>
  );
}