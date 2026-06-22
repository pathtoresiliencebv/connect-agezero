import "server-only";
import { Nango } from "@nangohq/node";

let cached: Nango | null = null;

export function getNangoServer(): Nango {
  if (cached) return cached;
  const secretKey = process.env.NANGO_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "NANGO_SECRET_KEY is not set. Add it to your environment before calling the gateway.",
    );
  }
  cached = new Nango({
    secretKey,
    ...(process.env.NANGO_API_BASE
      ? { baseUrl: process.env.NANGO_API_BASE }
      : {}),
  });
  return cached;
}