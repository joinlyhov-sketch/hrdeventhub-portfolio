"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { motion, Variants } from "framer-motion";
import { loginAction } from "../../../actions/auth.action";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginErrors = Partial<Record<"identifier" | "password", string>>;

export default function LoginComponent() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

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

    const result = loginSchema.safeParse({
      identifier: identifier.trim(),
      password,
    });

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
    formData.append("identifier", identifier.trim());
    formData.append("password", password);
    formData.append("rememberMe", String(rememberMe));

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) {
        setServerError(res.error);
        return;
      }
      if (res?.ok) {
        router.push(redirectUrl ?? "/group");
        toast.success(
          "Welcome to HRD EVENTHUB! You've successfully logged in.",
        );
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
      <div className="w-full max-w-[624px] rounded-[32px] border border-border bg-card/80 backdrop-blur-sm px-6 py-10 sm:px-10 sm:py-12 xl:p-18 shadow-sm">

        <div className="mb-10 text-center hidden md:block">
          <h1 className="type-title tracking-tight text-primary">
            Welcome Back !
          </h1>
          <p className="mt-2 type-subtitle text-secondary">
            Discover events with{" "}
            <span className="text-primary">HRD EventHub</span>
          </p>
          <p className="type-detail text-muted-foreground mt-1">
            Enter your credential to access the website
          </p>
        </div>

        <div className="mb-8 text-center md:hidden">
          <h1 className="type-subtitle-24 tracking-tight text-primary">
            Welcome Back !
          </h1>
          <p className="mt-1 type-desc-semibold text-secondary">
            Discover events with{" "}
            <span className="text-primary">HRD EventHub</span>
          </p>
          <p className="type-detail text-muted-foreground mt-1">
            Enter your credential to access the website
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-1">
          {serverError && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 type-detail text-destructive">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 transition-all focus-within:border-primary ${errors.identifier ? "border-destructive" : "border-border"}`}
            >
              <Mail
                size={18}
                className="shrink-0 text-grey-400"
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) =>
                  handleChange("identifier", e.target.value, setIdentifier)
                }
                className="w-full bg-transparent type-detail outline-none placeholder:text-muted-foreground text-foreground"
              />
            </div>
            {errors.identifier && <FieldError message={errors.identifier} />}
          </div>

          <div className="flex flex-col gap-1 pt-4">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 transition-all focus-within:border-primary ${errors.password ? "border-destructive" : "border-border"}`}
            >
              <Lock
                size={18}
                className="shrink-0 text-grey-400"
                strokeWidth={2}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  handleChange("password", e.target.value, setPassword)
                }
                className="w-full bg-transparent type-detail outline-none placeholder:text-muted-foreground text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="type-desc-small-semibold text-primary shrink-0"
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
                className="h-4 w-4 accent-primary"
              />
              <span className="type-detail text-grey-500">Remember me</span>
            </label>
            <a
              href="/reset-password"
              className="type-detail-semibold text-secondary underline underline-offset-2"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-5 h-[50px] w-full rounded-2xl bg-primary type-desc-semibold text-primary-foreground transition-all duration-300 hover:bg-[#1f4685] cursor-pointer disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Login"}
          </button>

          <p className="text-center type-detail text-muted-foreground pt-2">
            Don&apos;t have an account?{" "}
            <a
              href="/sign-up"
              className="type-detail-semibold text-secondary underline underline-offset-2"
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
    <p className="flex items-center gap-1.5 type-detail text-destructive px-1">
      <AlertCircle size={14} className="shrink-0" />
      {message}
    </p>
  );
}