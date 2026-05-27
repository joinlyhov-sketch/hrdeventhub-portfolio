"use client";

import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import { Mails, Phone, User, UsersRound } from "lucide-react";

type FormKey = "fullName" | "email" | "phone" | "generation";

const registerFields = [
  {
    icon: User,
    key: "fullName",
    label: "Full name",
    placeholder: "Your Full Name",
  },
  {
    icon: Mails,
    key: "email",
    label: "Email address",
    placeholder: "Your Email",
  },
  {
    icon: Phone,
    key: "phone",
    label: "Phone number",
    placeholder: "+855 XX XXX XXX",
  },
  {
    icon: UsersRound,
    key: "generation",
    label: "Generation",
    placeholder: "12",
  },
] as const;

export default function RegisterInfoStep() {
  const { form, updateForm, nextStep, closePaymentModal } =
    usePaymentModalStore();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h2 className="type-desc-semibold text-foreground">Your info</h2>
        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          Fill in your details to register
        </p>

        <div className="mt-1 space-y-2">
          {registerFields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.key}>
                <label className="type-detail-small-medium text-foreground">
                  {field.label}
                </label>

                <div className="relative mt-1">
                  <Icon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA6D8]"
                  />

                  <input
                    value={String(form[field.key as FormKey] ?? "")}
                    onChange={(e) =>
                      updateForm({ [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    className="
                      h-[32px] w-full rounded-[8px]
                      border border-[#BFD4F6]
                      bg-card pl-8 pr-3
                      type-detail-small-medium text-[#93A3CA]
                      outline-none transition
                      placeholder:text-[#8EA6D8]
                      focus:border-primary focus:ring-1 focus:ring-primary/30
                    "
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={closePaymentModal}
          className="h-9 flex-1 rounded-[8px] bg-muted type-detail-small-medium text-primary"
        >
          Cancel
        </button>

        <button
          onClick={nextStep}
          className="h-9 flex-1 rounded-[8px] bg-primary type-detail-small-medium text-primary-foreground"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}
