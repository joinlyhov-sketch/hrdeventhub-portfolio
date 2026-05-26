"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ResetPasswordStore = {
  step: number;
  email: string;
  resetToken: string;
  otpExpiresAt: number | null;
  setStep: (step: number) => void;
  storeEmail: (email: string) => void;
  storeToken: (token: string) => void;
  reset: () => void;
};

export const useResetPasswordStore = create<ResetPasswordStore>()(
  persist(
    (set) => ({
      step: 1,
      email: "",
      resetToken: "",
      otpExpiresAt: null,

      setStep: (step) => set({ step }),
      storeEmail: (email) =>
        set({
          email,
          step: 2,
          otpExpiresAt: Date.now() + 5 * 60 * 1000,
        }),

      storeToken: (token) => set({ resetToken: token, step: 3 }),

      reset: () =>
        set({ step: 1, email: "", resetToken: "", otpExpiresAt: null }),
    }),
    {
      name: "reset-password-store", 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);