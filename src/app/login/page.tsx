"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/feed");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gold-400">Book</span>MyEstate
          </h1>
          <p className="text-brand-400 text-sm mt-2">Discover your perfect property</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-brand-900/50 border border-white/10 rounded-2xl p-6">
          {error && (
            <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-brand-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-brand-800 border border-white/10 text-white placeholder-brand-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-brand-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-brand-800 border border-white/10 text-white placeholder-brand-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all text-sm"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-brand-950 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-brand-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gold-400 hover:text-gold-300 font-medium">
            Sign up
          </Link>
        </p>

        <div className="mt-6 p-4 rounded-xl bg-brand-900/30 border border-white/5 text-xs text-brand-500 space-y-1">
          <p className="font-medium text-brand-400">Demo accounts:</p>
          <p>Admin: admin@bookmyestate.com / admin123</p>
          <p>User: user1@test.com / test123</p>
        </div>
      </div>
    </div>
  );
}
