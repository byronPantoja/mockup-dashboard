"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Activity, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
            <Activity size={20} className="text-on-primary" />
          </div>
          <span className="text-lg font-semibold text-on-surface tracking-tight">
            BaseLine
          </span>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-surface-low p-6">
          <h1 className="text-lg font-semibold text-on-surface mb-1">
            Admin Login
          </h1>
          <p className="text-sm text-on-surface/50 mb-6">
            Sign in to view real leads and manage your pipeline.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl bg-surface-lowest px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:shadow-ambient transition-all"
                placeholder="itsme@byronpantoja.com"
              />
            </div>

            <div>
              <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl bg-surface-lowest px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:shadow-ambient transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-4 py-2.5 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity shadow-ambient disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Back to demo */}
        <p className="text-center text-sm text-on-surface/40 mt-6">
          <a href="/" className="hover:text-primary transition-colors">
            ← Back to demo dashboard
          </a>
        </p>
      </div>
    </div>
  );
}
