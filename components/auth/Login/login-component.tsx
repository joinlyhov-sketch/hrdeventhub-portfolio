"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { motion, Variants } from "framer-motion";
import { loginAction } from "../../../actions/auth.action";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});

type LoginErrors = Partial<Record<"email" | "password", string>>;

export default function LoginComponent() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (
    field: keyof LoginErrors,
    value: string,
    setter: (v: string) => void,
  ) => {
    setter(value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = loginSchema.safeParse({ email: email.trim(), password });

    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);
    formData.append("rememberMe", String(rememberMe));

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) {
        setServerError(res.error);
        return;
      }
      if (res?.ok) {
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
      <div className="w-[624px] rounded-[32px] border border-[#dce6f0] bg-[#f9fbff]/80 backdrop-blur-sm p-18 shadow-sm">
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-[#17356f]">
            Welcome Back !
          </h1>
          <p className="mt-2 text-[20px] font-semibold text-[#5f6470]">
            Discover events with{" "}
            <span className="text-[#1f4f98]">HRD EventHub</span>
          </p>
          <p className="text-[14px] text-[#8a92a6] mt-1">
            Enter your credential to access the website
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-1">
          {serverError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
                errors.email ? "border-red-400" : "border-[#dce6f0]"
              }`}
            >
              <Mail
                size={18}
                color="#b0bac9"
                strokeWidth={2}
                className="shrink-0"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  handleChange("email", e.target.value, setEmail)
                }
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
              />
            </div>
            {errors.email && <FieldError message={errors.email} />}
          </div>

          <div className="flex flex-col gap-1 pt-4">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus-within:border-[#24529a] ${
                errors.password ? "border-red-400" : "border-[#dce6f0]"
              }`}
            >
              <Lock
                size={18}
                color="#b0bac9"
                strokeWidth={2}
                className="shrink-0"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  handleChange("password", e.target.value, setPassword)
                }
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aab3c0] text-[#2d3748]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs font-semibold text-[#24529a] shrink-0"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <FieldError message={errors.password} />}
          </div>

          <div className="flex items-center justify-between px-1 pt-4">
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
            className="mt-5 h-[58px] w-full rounded-2xl bg-[#24529a] text-lg font-semibold text-white transition-all duration-300 hover:bg-[#1f4685] cursor-pointer disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-[#5f6470] pt-2">
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

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-sm text-red-500 px-1">
      <AlertCircle size={14} className="shrink-0" />
      {message}
    </p>
  );
}
