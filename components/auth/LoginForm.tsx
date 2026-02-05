"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/button/Button";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const labelStyles =
    "block text-xs font-medium text-muted mb-1 uppercase tracking-wider";
  const inputStyles =
    "w-full pl-3 pr-10 py-2 bg-inputboxbg border border-border rounded-md text-sm text-tertiary placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="w-full max-w-md bg-background rounded-xl border border-border p-8 shadow-2xl">
      <div className="text-center mb-8">
        <Link href="/">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-tertiary">Welcome Back</h1>
        <p className="text-muted text-sm mt-2">
          Please sign in to your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className={labelStyles}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyles}
          />
        </div>

        {/* Password Field Wrapper */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className={labelStyles}>
              Password
            </label>
            <Link
              href="#"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              // Toggle type here
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyles}
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-tertiary transition-colors focus:outline-none"
            >
              {showPassword ? (
                // Eye Open Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                // Eye Off Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 text-error text-xs p-3 rounded-md border border-error/20">
            {error}
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={loading}
        >
          Sign In
        </Button>
      </form>
      <p className="mt-8 text-center text-xs text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
