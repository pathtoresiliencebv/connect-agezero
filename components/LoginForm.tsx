"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [email, setEmail] = useState("demo@agezero.app");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card w-full max-w-sm p-6"
      aria-label="Sign in"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 to-violet-500 text-xs font-black text-white">
          A
        </div>
        <div className="text-sm font-semibold tracking-tight">
          Agezero Connect
        </div>
      </div>
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Sign in</h1>
      <p className="mb-5 text-xs text-muted-soft">
        Use the seed account from your <span className="kbd">.env.local</span>{" "}
        file.
      </p>

      <div className="space-y-3">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-xs text-rose-400" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        Don’t have an account?{" "}
        <a
          className="text-muted-soft underline hover:text-white"
          href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        >
          Create one
        </a>
        .
      </p>

      <p className="mt-4 text-center text-[11px] text-muted">
        By signing in, you agree to our{" "}
        <a className="underline hover:text-white" href="#">
          Terms
        </a>{" "}
        and{" "}
        <a className="underline hover:text-white" href="#">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}