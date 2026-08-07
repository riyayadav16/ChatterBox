import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MailIcon, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8">
      <div className="pointer-events-none absolute left-0 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-[32px] border border-white/80 bg-white/95 px-7 py-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:px-10 sm:py-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-white shadow-soft-blue">
              C
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">ChatterBox</p>
            <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">Welcome Back</h1>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Sign in to continue chatting with your friends.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="auth-input-label" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <MailIcon className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pr-4"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="auth-input-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <LockIcon className="auth-input-icon" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pr-4"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="auth-btn w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft-blue transition duration-200 hover:-translate-y-0.5 hover:bg-primary-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoggingIn ? <LoaderIcon className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-ink-muted">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold text-primary transition hover:text-primary-accent">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
