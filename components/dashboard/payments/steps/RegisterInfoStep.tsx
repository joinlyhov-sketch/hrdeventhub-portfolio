"use client";

import { usePaymentModalStore } from "../../../../store/usePaymentStoreModal";

type FormKey = "fullName" | "email" | "phone" | "generation" | "remark";

const registerFields: {
  key: FormKey;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "fullName",
    label: "Full name",
    placeholder: "Your Full Name",
  },
  {
    key: "email",
    label: "Email address",
    placeholder: "Your Email",
  },
  {
    key: "phone",
    label: "Phone number",
    placeholder: "+855 XX XXX XXX",
  },
  {
    key: "generation",
    label: "Generation",
    placeholder: "12",
  },
  {
    key: "remark",
    label: "Remark",
    placeholder: "Enter your remark here...",
  },
];

export default function RegisterInfoStep() {
  const { form, updateForm, nextStep, closePaymentModal } =
    usePaymentModalStore();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <h2 className="type-desc-semibold text-foreground">Your info</h2>
        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          Fill in your details to register
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {registerFields.map((field) => (
            <div key={field.key}>
              <label className="type-detail-small-medium text-foreground">
                {field.label}
              </label>

              <input
                value={String(form[field.key] ?? "")}
                onChange={(e) =>
                  updateForm({
                    [field.key]: e.target.value,
                  })
                }
                placeholder={field.placeholder}
                className="mt-1 h-10 w-full rounded-md border border-input bg-card px-4 type-detail-small-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex shrink-0 gap-3">
        <button
          onClick={closePaymentModal}
          className="h-10 flex-1 rounded-md bg-muted type-detail-small-medium text-secondary"
        >
          Cancel
        </button>

        <button
          onClick={nextStep}
          className="h-10 flex-1 rounded-md bg-primary type-detail-small-medium text-primary-foreground"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}
