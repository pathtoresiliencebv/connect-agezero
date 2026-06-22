"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/lib/tasks-store";

type LocalTask = Task;

function ageLabel(t: Task) {
  if (t.bucket === "Today") {
    const hours = Math.max(1, Math.round((Date.now() - new Date(t.createdAt).getTime()) / 3600_000));
    return `${hours}h`;
  }
  return `${t.ageDays ?? 0}d`;
}

function StatusIcon({ s }: { s: Task["status"] }) {
  if (s === "done") {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full border border-green-ok/40 bg-green-ok/10 text-[11px] text-green-ok">
        ✓
      </span>
    );
  }
  if (s === "running") {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full border border-amber-400/40 bg-amber-400/10 text-[11px] text-amber-300">
        ◌
      </span>
    );
  }
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full border border-line bg-white/[0.04] text-[11px] text-muted">
      ○
    </span>
  );
}

export default function TasksPanel({
  onNewTask,
}: {
  onNewTask: () => void;
}) {
  const [tasks, setTasks] = useState<LocalTask[] | null>(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((d) => setTasks(d.tasks));
  }, []);

  const today = tasks?.filter((t) => t.bucket === "Today") ?? [];
  const older = tasks?.filter((t) => t.bucket === "Older") ?? [];

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-ink-900/40 px-3 py-4 lg:flex">
      <button
        onClick={onNewTask}
        className="btn-primary mb-3 w-full"
      >
        + New Task
      </button>

      <div className="space-y-1 overflow-y-auto">
        <div className="px-1 py-1 text-[11px] font-medium uppercase tracking-wider text-muted">
          Today
        </div>
        {today.map((t) => (
          <button
            key={t.id}
            className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs hover:bg-white/[0.04]"
          >
            <StatusIcon s={t.status} />
            <span className="flex-1 truncate">{t.title}</span>
            <span className="text-[10px] text-muted">{ageLabel(t)}</span>
          </button>
        ))}

        <div className="px-1 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-muted">
          Older
        </div>
        {older.map((t) => (
          <button
            key={t.id}
            className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs hover:bg-white/[0.04]"
          >
            <StatusIcon s={t.status} />
            <span className="flex-1 truncate">{t.title}</span>
            <span className="text-[10px] text-muted">{ageLabel(t)}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}