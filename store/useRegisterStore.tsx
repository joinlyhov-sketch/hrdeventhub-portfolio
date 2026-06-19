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

export type RegisterFieldErrors = Partial<
  Record<keyof RegisterFormFields, string>
>;

type RegisterStore = {
  step: number;
  otpEmail: string;
  form: RegisterFormFields;
  fieldErrors: RegisterFieldErrors;
  otpExpiresAt: number | null;

  setStep: (step: number) => void;

  updateField: <K extends keyof RegisterFormFields>(
    field: K,
    value: RegisterFormFields[K],
  ) => void;

  setFieldError: <K extends keyof RegisterFormFields>(
    field: K,
    error: string | null,
  ) => void;

  clearFieldError: <K extends keyof RegisterFormFields>(field: K) => void;

  clearAllFieldErrors: () => void;

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
      fieldErrors: {},
      otpExpiresAt: null,

      setStep: (step) => set({ step }),

      updateField: (field, value) =>
        set((state) => ({
          form: {
            ...state.form,
            [field]: value,
          },
          fieldErrors: {
            ...state.fieldErrors,
            [field]: undefined,
          },
        })),

      setFieldError: (field, error) =>
        set((state) => {
          const nextErrors = { ...state.fieldErrors };

          if (!error) {
            delete nextErrors[field];
          } else {
            nextErrors[field] = error;
          }

          return {
            fieldErrors: nextErrors,
          };
        }),

      clearFieldError: (field) =>
        set((state) => {
          const nextErrors = { ...state.fieldErrors };
          delete nextErrors[field];

          return {
            fieldErrors: nextErrors,
          };
        }),

      clearAllFieldErrors: () =>
        set({
          fieldErrors: {},
        }),

      goToOTP: (email) =>
        set({
          otpEmail: email,
          step: 3,
          otpExpiresAt: Date.now() + 5 * 60 * 1000,
        }),

      reset: () =>
        set({
          step: 1,
          otpEmail: "",
          form: defaultForm,
          fieldErrors: {},
          otpExpiresAt: null,
        }),
    }),
    {
      name: "register-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);