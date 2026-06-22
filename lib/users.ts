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

function ensureFile() {
  // On serverless platforms (Vercel) the filesystem is read-only, so any
  // mkdir/write here will throw. We swallow the error and let the calling
  // code (authorizeSeedDirect / readAll) fall through to the env fallback.
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]", "utf8");
  } catch {
    /* read-only filesystem — fall through to env-only auth */
  }
}

function readAll(): StoredUser[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8")) as StoredUser[];
  } catch {
    return [];
  }
}

function writeAll(users: StoredUser[]): { ok: true } | { ok: false; error: string } {
  try {
    ensureFile();
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2), "utf8");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? e.message
          : "Could not persist users (read-only filesystem).",
    };
  }
}

/**
 * Idempotent: if the env-configured seed user doesn't exist yet, create it.
 *
 * Two ways to set the password:
 *  1. `SEED_USER_PASSWORD_PLAIN` — a plaintext password, hashed on first boot
 *     and persisted to users.json. Easiest for local dev.
 *  2. `SEED_USER_PASSWORD_HASH` — a pre-computed bcrypt hash. Note that
 *     bcrypt hashes start with `$2a$10$...` which gets expanded by Next.js
 *     env loading, so you'll need to escape it as `\$2a\$10\$...` in
 *     .env.local. Prefer option 1 unless you're shipping a baked image.
 */
export async function ensureSeedUser() {
  const email = process.env.SEED_USER_EMAIL;
  const name = process.env.SEED_USER_NAME;
  if (!email) return;

  const users = readAll();
  if (users.some((u) => u.email === email)) return;

  let hash = process.env.SEED_USER_PASSWORD_HASH ?? "";
  const plain = process.env.SEED_USER_PASSWORD_PLAIN;
  if (!hash && plain) {
    hash = await bcrypt.hash(plain, 10);
  }
  if (!hash) return;

  users.push({
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    email,
    name: name || email.split("@")[0],
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  });
  writeAll(users);
  // If writes fail (e.g. on Vercel serverless) we silently continue — the
  // seed user will be re-attempted on every authorize() call. The /login
  // page will surface a more useful error when the password check fails.
  // For production, swap this for Vercel KV / Postgres (see README).
}

export async function findUserByEmail(
  email: string,
): Promise<StoredUser | null> {
  const users = readAll();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function verifyPassword(
  user: StoredUser,
  password: string,
): Promise<boolean> {
  if (!user.passwordHash) return false;
  return bcrypt.compare(password, user.passwordHash);
}