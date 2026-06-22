"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/home";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Could not create account.");
        setLoading(false);
        return;
      }

      // Account created — sign in immediately.
      const sign = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      setLoading(false);
      if (!sign || sign.error) {
        // Account exists but sign-in failed for some reason — send to /login.
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card w-full max-w-sm p-6"
      aria-label="Create account"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 to-violet-500 text-xs font-black text-white">
          A
        </div>
        <div className="text-sm font-semibold tracking-tight">
          Agezero Connect
        </div>
      </div>
      <h1 className="mb-1 text-xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mb-5 text-xs text-muted-soft">
        Free demo. No credit card. (Data lives in memory on Vercel — see README.)
      </p>

      <div className="space-y-3">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
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
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-xs text-rose-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-5 w-full"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        Already have an account?{" "}
        <a
          className="text-muted-soft underline hover:text-white"
          href="/login"
        >
          Sign in
        </a>
        .
      </p>

      <p className="mt-4 text-center text-[11px] text-muted">
        By creating an account, you agree to our{" "}
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