"use client";

import Nango from "@nangohq/frontend";

let cached: Nango | null = null;

export function getNangoClient(): Nango | null {
  if (cached) return cached;
  const publicKey = process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY;
  if (!publicKey) return null;
  cached = new Nango({ publicKey });
  return cached;
}

export function hasNangoPublicKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY);
}