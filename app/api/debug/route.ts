import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    hasSession: !!session,
    sessionUser: session?.user ?? null,
    env: {
      hasSeedEmail: !!process.env.SEED_USER_EMAIL,
      seedEmail: process.env.SEED_USER_EMAIL ?? null,
      hasSeedPlain: !!process.env.SEED_USER_PASSWORD_PLAIN,
      seedPlainLen: process.env.SEED_USER_PASSWORD_PLAIN?.length ?? 0,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL ?? null,
    },
  });
}
