import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail, ensureSeedUser } from "@/lib/users";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type KeyRecord = {
  id: string;
  userId: string;
  label: string;
  prefix: string;
  hash: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const keysFile = path.join(dataDir, "keys.json");

function readKeys(): KeyRecord[] {
  if (!fs.existsSync(keysFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(keysFile, "utf8")) as KeyRecord[];
  } catch {
    return [];
  }
}

function writeKeys(keys: KeyRecord[]): { ok: true } | { ok: false; error: string } {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2), "utf8");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? e.message
          : "Could not persist keys (read-only filesystem).",
    };
  }
}

function makeApiKey(): { plain: string; prefix: string; hash: string } {
  const plain = `azc_${randomBytes(24).toString("base64url")}`;
  const prefix = `${plain.slice(0, 7)}…${plain.slice(-4)}`;
  const hash = createHash("sha256").update(plain).digest("hex");
  return { plain, prefix, hash };
}

/**
 * GET /api/keys — returns the list of API keys for the current user.
 * Never returns the plaintext, only the prefix and metadata.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const all = readKeys().filter((k) => k.userId === session.user.id);
  return NextResponse.json({ keys: all });
}

/**
 * POST /api/keys — mints a new API key for the current user. The plaintext
 * is returned exactly once in the response; we only persist the hash.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  await ensureSeedUser();
  const user = await findUserByEmail(session.user.email ?? "");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { plain, prefix, hash } = makeApiKey();
  const all = readKeys();
  all.push({
    id: `key_${randomBytes(8).toString("hex")}`,
    userId: user.id,
    label: "Default key",
    prefix,
    hash,
    createdAt: new Date().toISOString(),
  });
  const w = writeKeys(all);
  if (!w.ok) {
    return NextResponse.json(
      {
        error:
          "Could not persist key — Vercel serverless filesystems are read-only. " +
          "Swap the file-backed store in lib/ for Vercel KV or Postgres to enable. " +
          `Underlying error: ${w.error}`,
      },
      { status: 503 },
    );
  }
  return NextResponse.json({ key: plain, prefix });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  const all = readKeys().filter(
    (k) => !(k.id === id && k.userId === session.user.id),
  );
  writeKeys(all);
  return NextResponse.json({ ok: true });
}