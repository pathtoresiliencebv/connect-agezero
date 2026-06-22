// A small in-memory + file-backed store for demo tasks. Lets the UI feel
// alive without needing a real DB. Persists under data/tasks.json.

import fs from "node:fs";
import path from "node:path";

export type Task = {
  id: string;
  title: string;
  status: "done" | "running" | "queued" | "error";
  bucket: "Today" | "Older";
  createdAt: string;
  ageDays?: number;
};

const dataDir = path.join(process.cwd(), "data");
const file = path.join(dataDir, "tasks.json");

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(file)) {
    const seed: Task[] = [
      {
        id: "t1",
        title: "Connect Ahrefs Account",
        status: "running",
        bucket: "Today",
        createdAt: new Date(Date.now() - 1 * 3600_000).toISOString(),
        ageDays: 0,
      },
      {
        id: "t2",
        title: "Build a Jarvis AI Agent",
        status: "done",
        bucket: "Older",
        createdAt: new Date(Date.now() - 33 * 86_400_000).toISOString(),
        ageDays: 33,
      },
      {
        id: "t3",
        title: "This Week's Calendar",
        status: "done",
        bucket: "Older",
        createdAt: new Date(Date.now() - 36 * 86_400_000).toISOString(),
        ageDays: 36,
      },
      {
        id: "t4",
        title: "Autonomous CLI Function Calling",
        status: "done",
        bucket: "Older",
        createdAt: new Date(Date.now() - 37 * 86_400_000).toISOString(),
        ageDays: 37,
      },
      {
        id: "t5",
        title: 'Clarify Meaning of "gi"',
        status: "done",
        bucket: "Older",
        createdAt: new Date(Date.now() - 37 * 86_400_000).toISOString(),
        ageDays: 37,
      },
      {
        id: "t6",
        title: "Connect MCP Base4…",
        status: "done",
        bucket: "Older",
        createdAt: new Date(Date.now() - 86 * 86_400_000).toISOString(),
        ageDays: 86,
      },
    ];
    fs.writeFileSync(file, JSON.stringify(seed, null, 2), "utf8");
  }
}

export function listTasks(): Task[] {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as Task[];
  } catch {
    return [];
  }
}

export function addTask(title: string): Task {
  const all = listTasks();
  const t: Task = {
    id: `t_${Math.random().toString(36).slice(2, 8)}`,
    title,
    status: "queued",
    bucket: "Today",
    createdAt: new Date().toISOString(),
    ageDays: 0,
  };
  all.unshift(t);
  fs.writeFileSync(file, JSON.stringify(all, null, 2), "utf8");
  return t;
}