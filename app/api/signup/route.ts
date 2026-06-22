import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { email?: string; name?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, name, password } = body;
  if (!email || !name || !password) {
    return NextResponse.json(
      { error: "email, name and password are required" },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  const result = await createUser({ email, name, password });
  if (!result.ok) {
    if (result.error === "exists") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    user: { id: result.user.id, email: result.user.email, name: result.user.name },
  });
}