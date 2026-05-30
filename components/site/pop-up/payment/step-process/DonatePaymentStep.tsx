"use client";

import { Switch } from "@/components/ui/toggle/switch";
import { donationAmounts } from "@/data/paymentData";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import { Plus } from "lucide-react";

export default function DonateAmountStep() {
  const { form, updateForm, nextStep, closePaymentModal } =
    usePaymentModalStore();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h2 className="type-desc-semibold text-foreground">
          How would you like to donate?
        </h2>

        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          Choose your amount and visibility
        </p>

        <p className="mt-4 type-detail-small-medium text-foreground">
          Select amount
        </p>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {donationAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => updateForm({ amount })}
              className={`h-8 rounded-md border type-detail-medium ${
                form.amount === amount
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-card text-foreground"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        <button
          onClick={() => updateForm({ amount: 0 })}
          className="mt-2 flex h-8 w-full items-center justify-center gap-1 rounded-md bg-accent/20 type-detail-medium text-secondary"
        >
          <Plus size={15} />
          Custom Amount
        </button>

        <p className="mt-3 type-detail-small-medium text-foreground">
          Input amount
        </p>

        <input
          type="number"
          placeholder="$"
          defaultValue={form.amount}
          onChange={(e) => updateForm({ amount: Number(e.target.value) })}
          className="mt-1 h-8 w-full rounded-md border border-input px-4 text-center type-detail outline-none focus:ring-1 focus:ring-ring"
        />
        <label className="mt-3 flex items-center justify-between rounded-md bg-muted px-4 py-2">
          <span className="type-detail-medium text-foreground">
            Pay anonymously
            <p className="type-detail-small-medium text-muted-foreground">
              Your name won&apos;t appear in the donation list
            </p>
          </span>

          <Switch />
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={closePaymentModal}
          className="h-9 flex-1 rounded-md bg-muted type-detail-small-medium text-secondary"
        >
          Back
        </button>

        <button
          onClick={nextStep}
          className="h-9 flex-1 rounded-md bg-primary type-detail-small-medium text-primary-foreground"
        >
          Generate QR
        </button>
      </div>
    </div>
  );
}
