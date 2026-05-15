import { create } from "zustand";

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
  setStep: (step: number) => void;
  updateField: <K extends keyof RegisterFormFields>(field: K, value: RegisterFormFields[K]) => void;
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

export const useRegisterStore = create<RegisterStore>((set) => ({
  step: 1,
  otpEmail: "",
  form: defaultForm,

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
    }),

  reset: () =>
    set({
      step: 1,
      otpEmail: "",
      form: defaultForm,
    }),
}));