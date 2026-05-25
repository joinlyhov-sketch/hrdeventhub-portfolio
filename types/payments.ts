export type PaymentMode = "register" | "donation";

export type PaymentStep = 1 | 2 | 3;

export type PaymentForm = {
  fullName: string;
  email: string;
  phone: string;
  generation: string;
  remark: string;
  amount: number;
  anonymous: boolean;
};
