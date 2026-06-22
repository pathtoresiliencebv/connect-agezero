"use client";

import { useRef } from "react";
import TasksPanel from "@/components/TasksPanel";
import TaskChat from "@/components/TaskChat";

export default function TasksPage() {
  const refreshRef = useRef<() => void>(() => {});

  return (
    <div className="flex h-[calc(100vh-0px)] -mx-4 -mt-6 md:-mx-8">
      <TasksPanel onNewTask={() => refreshRef.current?.()} />
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <TaskChat
          onSubmitted={() => {
            // trigger a small refresh
            window.dispatchEvent(new Event("agezero:tasks-refresh"));
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}