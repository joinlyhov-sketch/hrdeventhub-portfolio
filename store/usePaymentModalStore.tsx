import { create } from "zustand";
import type { PaymentForm, PaymentMode, PaymentStep } from "../types/payments";

type PaymentModalStore = {
  isOpen: boolean;
  mode: PaymentMode;
  step: PaymentStep;
  form: PaymentForm;

  openPaymentModal: (mode: PaymentMode) => void;
  closePaymentModal: () => void;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (data: Partial<PaymentForm>) => void;
};

const defaultForm: PaymentForm = {
  fullName: "Suoy Sovichea",
  email: "sovichea@gmail.com",
  phone: "+855 XX XXX XXX",
  generation: "12",
  dollarSign: "$",
  amount: 15,
  anonymous: false,
};

export const usePaymentModalStore = create<PaymentModalStore>((set) => ({
  isOpen: false,
  mode: "register",
  step: 1,
  form: defaultForm,

  openPaymentModal: (mode) =>
    set({
      isOpen: true,
      mode,
      step: 1,
      form: defaultForm,
    }),

  closePaymentModal: () =>
    set({
      isOpen: false,
      step: 1,
      form: defaultForm,
    }),

  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, 3) as PaymentStep,
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1) as PaymentStep,
    })),

  updateForm: (data) =>
    set((state) => ({
      form: {
        ...state.form,
        ...data,
      },
    })),
}));
