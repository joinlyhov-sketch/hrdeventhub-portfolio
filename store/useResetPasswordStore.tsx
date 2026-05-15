import { create } from "zustand";

type ResetPasswordStore = {
  step: number;
  email: string;
  resetToken: string;
  setStep: (step: number) => void;
  storeEmail: (email: string) => void;       
  storeToken: (token: string) => void;       
  reset: () => void;            
};

export const useResetPasswordStore = create<ResetPasswordStore>((set) => ({
  step: 1,
  email: "",
  resetToken: "",
  setStep: (step) => set({ step }),
  storeEmail: (email) => set({ email, step: 2 }),
  storeToken: (token) => set({ resetToken: token, step: 3 }),
  reset: () => set({ step: 1, email: "", resetToken: "" }),
}));