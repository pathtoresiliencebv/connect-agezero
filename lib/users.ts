import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "users.json");

/**
 * Module-level in-memory map. Acts as the fallback store on serverless
 * platforms (Vercel) where the filesystem is read-only. Survives within a
 * single warm function instance but is wiped on every cold start — fine for
 * a demo, NOT fine for production. See README → "Swapping the store" for
 * the Vercel KV / Postgres migration path.
 */
declare global {
  // eslint-disable-next-line no-var
  var __agezeroUserStore: Map<string, StoredUser> | undefined;
}
const memStore: Map<string, StoredUser> =
  globalThis.__agezeroUserStore ?? new Map<string, StoredUser>();
globalThis.__agezeroUserStore = memStore;

function fsAvailable(): boolean {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

function readFromDisk(): StoredUser[] {
  if (!fsAvailable() || !fs.existsSync(dataFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8")) as StoredUser[];
  } catch {
    return [];
  }
}

function writeToDisk(users: StoredUser[]): boolean {
  if (!fsAvailable()) return false;
  try {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

/**
 * Read all users. Merges disk + in-memory so that locally-created users
 * and serverless-only users coexist for the lifetime of the warm instance.
 */
function readAll(): StoredUser[] {
  const disk = readFromDisk();
  // Re-seed the in-memory store from disk on first call.
  if (disk.length && memStore.size === 0) {
    for (const u of disk) memStore.set(u.email.toLowerCase(), u);
  }
  // Merge: in-memory wins on conflict (newer).
  const merged = new Map<string, StoredUser>();
  for (const u of disk) merged.set(u.email.toLowerCase(), u);
  for (const u of memStore.values()) merged.set(u.email.toLowerCase(), u);
  return Array.from(merged.values());
}

function persist(users: StoredUser[]): void {
  // Always keep memory fresh.
  memStore.clear();
  for (const u of users) memStore.set(u.email.toLowerCase(), u);
  // Best-effort disk write (ignored on read-only fs).
  writeToDisk(users);
}

/**
 * Idempotent: if the env-configured seed user doesn't exist yet, create it.
 * Tries to persist to disk; if that fails (serverless), we keep it in
 * memory and `authorizeSeedDirect` in lib/auth.ts takes over.
 */
export async function ensureSeedUser() {
  const email = process.env.SEED_USER_EMAIL;
  const name = process.env.SEED_USER_NAME;
  if (!email) return;

  const all = readAll();
  if (all.some((u) => u.email.toLowerCase() === email.toLowerCase())) return;

  let hash = process.env.SEED_USER_PASSWORD_HASH ?? "";
  const plain = process.env.SEED_USER_PASSWORD_PLAIN;
  if (!hash && plain) {
    hash = await bcrypt.hash(plain, 10);
  }
  if (!hash) return;

  const user: StoredUser = {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    email,
    name: name || email.split("@")[0],
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  };
  all.push(user);
  persist(all);
}

export async function findUserByEmail(
  email: string,
): Promise<StoredUser | null> {
  const all = readAll();
  return (
    all.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export async function verifyPassword(
  user: StoredUser,
  password: string,
): Promise<boolean> {
  if (!user.passwordHash) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<
  | { ok: true; user: StoredUser }
  | { ok: false; error: "exists" | "invalid" }
> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const password = input.password;

  if (!email || !name || password.length < 6) return { ok: false, error: "invalid" };

  const all = readAll();
  if (all.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "exists" };
  }

  const user: StoredUser = {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    email,
    name,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };
  all.push(user);
  persist(all);
  return { ok: true, user };
}