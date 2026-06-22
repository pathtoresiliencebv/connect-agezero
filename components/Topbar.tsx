"use client";

import { usePathname } from "next/navigation";
import MegaMenu from "@/components/MegaMenu";
import { MessageSquare, Users } from "lucide-react";

const titleByPath: Record<string, { title: string }> = {
  "/home": { title: "Home" },
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
      pathname === p || pathname.startsWith(`${p}/`),
    )?.[1] ?? { title: "Agezero Connect" };

  return (
    <header className="sticky top-0 z-10 -mx-4 mb-6 flex items-center justify-between border-b border-line bg-ink-900/80 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      <div className="text-sm font-semibold tracking-tight">{meta.title}</div>
      <div className="flex items-center gap-1 text-xs text-muted-soft">
        <MegaMenu align="right" buttonLabel="Toolkits" />
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-white/[0.04] hover:text-white"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Feedback
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-white/[0.04] hover:text-white"
        >
          <Users className="h-3.5 w-3.5" />
          Community
        </a>
      </div>
    </header>
  );
}