import { create } from "zustand";

type ResetPasswordState = {
  step: 1 | 2 | 3;
  email: string;
  resetToken: string;
  otpExpiresAt: number | null;
};

type ResetPasswordActions = {
  advanceToVerify: (email: string) => void;
  advanceToNewPassword: (resetToken: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
};

export type ResetPasswordStore = ResetPasswordState & ResetPasswordActions;

const INITIAL_STATE: ResetPasswordState = {
  step: 1,
  email: "",
  resetToken: "",
  otpExpiresAt: null,
};

export const useResetPasswordStore = create<ResetPasswordStore>()((set) => ({
  ...INITIAL_STATE,

  advanceToVerify: (email: string) =>
    set({
      email,
      step: 2,
      otpExpiresAt: Date.now() + 5 * 60 * 1000,
    }),

  advanceToNewPassword: (resetToken: string) =>
    set({
      resetToken,
      step: 3,
    }),

  setEmail: (email: string) => set({ email }),

  reset: () => set(INITIAL_STATE),
}));