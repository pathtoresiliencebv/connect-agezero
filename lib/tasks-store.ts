// A small in-memory + file-backed store for demo tasks. Lets the UI feel
// alive without needing a real DB. On serverless platforms (Vercel) the
// filesystem is read-only, so we keep a copy of the seed in memory and
// fall back to it when fs operations fail.

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

function seedTasks(): Task[] {
  return [
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
}

function tryReadFromDisk(): Task[] | null {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as Task[];
  } catch {
    return null;
  }
}

export function listTasks(): Task[] {
  return tryReadFromDisk() ?? seedTasks();
}

export function addTask(title: string): Task {
  const t: Task = {
    id: `t_${Math.random().toString(36).slice(2, 8)}`,
    title,
    status: "queued",
    bucket: "Today",
    createdAt: new Date().toISOString(),
    ageDays: 0,
  };
  // Best-effort persistence; ignore failure on read-only filesystems.
  try {
    const all = tryReadFromDisk() ?? seedTasks();
    all.unshift(t);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(all, null, 2), "utf8");
  } catch {
    /* serverless — caller will see t in the current response, future
       requests will fall back to the seed. */
  }
  return t;
}