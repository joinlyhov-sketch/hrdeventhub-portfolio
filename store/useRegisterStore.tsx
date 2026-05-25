"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RegisterFormFields = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterStore = {
  step: number;
  otpEmail: string;
  form: RegisterFormFields;
  otpExpiresAt: number | null; 
  setStep: (step: number) => void;
  updateField: <K extends keyof RegisterFormFields>(
    field: K,
    value: RegisterFormFields[K]
  ) => void;
  goToOTP: (email: string) => void;
  reset: () => void;
};

const defaultForm: RegisterFormFields = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const useRegisterStore = create<RegisterStore>()(
  persist(
    (set) => ({
      step: 1,
      otpEmail: "",
      form: defaultForm,
      otpExpiresAt: null,

      setStep: (step) => set({ step }),

      updateField: (field, value) =>
        set((state) => ({
          form: { ...state.form, [field]: value },
        })),

      goToOTP: (email) =>
        set({
          otpEmail: email,
          form: defaultForm,
          step: 3,
          otpExpiresAt: Date.now() + 5 * 60 * 1000,
        }),

      reset: () =>
        set({
          step: 1,
          otpEmail: "",
          form: defaultForm,
          otpExpiresAt: null,
        }),
    }),
    {
      name: "register-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);