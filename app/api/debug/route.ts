import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const seedPlain = process.env.SEED_USER_PASSWORD_PLAIN ?? "";
  let bcryptOk = false;
  let bcryptErr: string | null = null;
  try {
    const bcrypt = (await import("bcryptjs")).default;
    bcryptOk = await bcrypt.compare("demo", seedPlain);
  } catch (e) {
    bcryptErr = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json({
    hasSession: !!session,
    sessionUser: session?.user ?? null,
    env: {
      hasSeedEmail: !!process.env.SEED_USER_EMAIL,
      seedEmail: process.env.SEED_USER_EMAIL ?? null,
      hasSeedPlain: !!process.env.SEED_USER_PASSWORD_PLAIN,
      seedPlainLen: process.env.SEED_USER_PASSWORD_PLAIN?.length ?? 0,
      seedPlainPreview: process.env.SEED_USER_PASSWORD_PLAIN?.slice(0, 4) ?? null,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
    },
    bcryptCheck: { ok: bcryptOk, err: bcryptErr },
  });
}
