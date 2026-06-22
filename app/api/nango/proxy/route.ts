import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNangoServer } from "@/lib/nango-server";

export const runtime = "nodejs";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let payload: {
    providerConfigKey?: string;
    connectionId?: string;
    method?: Method;
    endpoint?: string;
    data?: unknown;
    params?: Record<string, string | number | string[] | number[]>;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { providerConfigKey, connectionId, method, endpoint, data, params } =
    payload;
  if (!providerConfigKey || !connectionId || !method || !endpoint) {
    return NextResponse.json(
      {
        error:
          "providerConfigKey, connectionId, method and endpoint are required",
      },
      { status: 400 },
    );
  }

  try {
    const nango = getNangoServer();
    const baseConfig = {
      endpoint,
      providerConfigKey,
      connectionId,
      ...(data !== undefined ? { data } : {}),
      ...(params ? { params } : {}),
    };

    let res;
    if (method === "PUT") {
      res = await nango.proxy({ ...baseConfig, method: "PUT" });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res = await (nango as any)[method.toLowerCase()](baseConfig);
    }
    return NextResponse.json(res.data ?? res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}