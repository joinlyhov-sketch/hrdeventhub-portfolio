"use client";

import { useState, useTransition } from "react";
import { motion, Variants } from "framer-motion";
import { loginAction } from "../../../actions/auth.action";
import { useRouter } from "next/navigation";

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.ok) {
        router.push("/group");
      }
    });
  };

  return (
    <motion.div
      variants={itemVars}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center w-full"
    >
      <div className="w-[500px] rounded-[30px] border border-[#c8d6ee] bg-[#f9fbff] p-10">
        <div className="mb-10 text-center">
          <h1 className="text-[42px] font-extrabold tracking-[-2px] text-[#17356f]">
            Welcome Back
          </h1>
          <p className="mt-2 text-[#6e7580]">
            Enter your details to access your hub
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b0bac9"
              strokeWidth="2"
              className="shrink-0"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f0] bg-white px-4 py-3.5 focus-within:border-[#24529a] transition-all">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b0bac9"
              strokeWidth="2"
              className="shrink-0"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#24529a]"
              />
              <span className="text-sm text-[#4d5663]">Remember me</span>
            </label>
            <a
              href="/reset-password"
              className="text-sm font-semibold text-[#17356f] underline underline-offset-2"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="mt-3 h-[58px] w-full rounded-2xl bg-[#24529a] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] cursor-pointer disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-[#5f6470]">
            Don&apos;t have an account?{" "}
            <a
              href="/sign-up"
              className="font-semibold text-[#17356f] underline underline-offset-2"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </motion.div>
  );
}
