"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { motion, Variants } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/service/auth.service";
import { useRegisterStore } from "@/store/useRegisterStore";
import { X } from "lucide-react";
import { DEMO_MODE } from "@/libs/demo/config";

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
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
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
    if (DEMO_MODE) {
      router.push("/group");
      return;
    }

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

    startTransition(async () => {
      const res = await signIn("credentials", {
        identifier: identifier.trim(),
        password,
        rememberMe: String(rememberMe),
        redirect: false,
      });

      if (res?.error) {
        if (res.error.startsWith("NOT_VERIFIED:")) {
          const email = res.error.split(":")[1];
          setUnverifiedEmail(email);
          setShowVerifyModal(true);
          return;
        }

        setServerError(
          res.error === "CredentialsSignin"
            ? "Invalid email or password."
            : "Something went wrong. Please try again."
        );
        return;
      }
      if (res?.ok) {
        toast.success(
          "Welcome to HRD EVENTHUB! You've successfully logged in.",
        );
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          router.push("/group");
        }
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
      <div className="w-full max-w-156 rounded-[28px] border border-border bg-card/80 backdrop-blur-sm px-6 py-8 sm:px-10 sm:py-12 xl:px-16 xl:py-14 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] sm:text-[30px] font-extrabold tracking-tight text-primary">
            Welcome Back!
          </h1>
          <p className="mt-1.5 text-sm sm:text-base font-semibold text-secondary">
            Discover events with{" "}
            <span className="text-primary">HRD EventHub</span>
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {DEMO_MODE ? "Demo access is ready. Click Login to explore." : "Enter your credentials to access the website"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {serverError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {serverError}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 sm:py-3.5 transition-all focus-within:border-primary ${errors.identifier ? "border-destructive" : "border-border"
                }`}
            >
              <Mail size={18} className="shrink-0 text-muted-foreground" strokeWidth={2} />
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) =>
                  handleChange("identifier", e.target.value.toLowerCase(), setIdentifier)
                }
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              />
            </div>
            {errors.identifier && <FieldError message={errors.identifier} />}
          </div>
          <div className="flex flex-col gap-1.5">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 sm:py-3.5 transition-all focus-within:border-primary ${errors.password ? "border-destructive" : "border-border"
                }`}
            >
              <Lock size={18} className="shrink-0 text-muted-foreground" strokeWidth={2} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  handleChange("password", e.target.value, setPassword)
                }
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs font-semibold text-primary shrink-0 hover:cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <FieldError message={errors.password} />}
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-primary cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <a
              href="/reset-password"
              className="text-sm font-semibold text-secondary underline underline-offset-2"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="h-12 sm:h-12.5 w-full rounded-2xl bg-primary text-sm sm:text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-[#1f4685] cursor-pointer disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}

            <a href={redirectUrl ? `/sign-up?redirect=${encodeURIComponent(redirectUrl)}` : "/sign-up"}
              className="font-semibold text-secondary underline underline-offset-2"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>

      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-[24px] bg-card p-6 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Mail size={24} />
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                disabled={isResending}
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">Account Not Verified</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your account hasn't been verified yet. Would you like to verify it now? We will send a new OTP to <span className="font-semibold text-foreground">{unverifiedEmail}</span>.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowVerifyModal(false)}
                disabled={isResending}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setIsResending(true);
                    await authService.resendOtp(unverifiedEmail);
                    useRegisterStore.getState().goToOTP(unverifiedEmail);
                    router.push("/sign-up");
                    toast.success("A new OTP has been sent to your email.");
                  } catch (err) {
                    toast.error("Failed to resend OTP. Please try again.");
                  } finally {
                    setIsResending(false);
                    setShowVerifyModal(false);
                  }
                }}
                disabled={isResending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-[#1f4685] transition-colors disabled:opacity-70 cursor-pointer"
              >
                {isResending ? "Sending..." : "Verify Now"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive px-1">
      <AlertCircle size={14} className="shrink-0" />
      {message}
    </p>
  );
}
