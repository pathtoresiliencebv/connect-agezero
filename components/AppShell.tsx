import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 md:px-8">
        <Topbar />
        <div className="animate-fade-in pb-12">{children}</div>
      </main>
    </div>
  );
}