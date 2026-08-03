"use client";

import Link from "next/link";
import { useState } from "react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Replace with a call to the Express backend, e.g.:
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error("Invalid email or password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#1B3A2B]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@farmname.com"
          className="mt-1.5 w-full rounded-md border border-[#3B2F22]/20 bg-white px-3.5 py-2.5 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#1B3A2B]"
          >
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-xs font-medium text-[#2F5F3F] underline-offset-4 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative mt-1.5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-[#3B2F22]/20 bg-white px-3.5 py-2.5 pr-16 text-sm text-[#1B3A2B] placeholder:text-[#3B2F22]/35 focus:border-[#2F5F3F] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#2F5F3F] hover:text-[#1B3A2B]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          className="h-4 w-4 rounded border-[#3B2F22]/30 text-[#2F5F3F] focus:ring-[#2F5F3F]/30"
        />
        <label htmlFor="remember" className="text-sm text-[#3B2F22]/70">
          Keep me signed in
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#B4442E]">
          {error}
        </p>
      )}

      {/* <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#2F5F3F] py-2.5 text-sm font-medium text-[#FAF7EE] transition-colors hover:bg-[#1B3A2B] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/40 focus:ring-offset-2 disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button> */}
     <Link
        href="/farmer/dashboard"
        className="mt-10 inline-flex w-95 items-center justify-center rounded-md bg-[#2F5F3F] py-2.5 text-sm font-medium text-[#FAF7EE] transition-colors hover:bg-[#1B3A2B] focus:outline-none focus:ring-2 focus:ring-[#2F5F3F]/40 focus:ring-offset-2 disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Link>
    </form>
  );
}