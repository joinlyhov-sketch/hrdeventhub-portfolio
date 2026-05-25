"use client";

import { donationAmounts } from "../../../../data/paymentData";
import { usePaymentModalStore } from "../../../../store/usePaymentStoreModal";
import { Plus } from "lucide-react";

export default function DonateAmountStep() {
  const { form, updateForm, nextStep, closePaymentModal } =
    usePaymentModalStore();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <h2 className="type-desc-semibold text-foreground">
          How would you like to donate?
        </h2>
        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          Choose your amount and visibility
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-2">
          {donationAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => updateForm({ amount })}
              className={`h-10 rounded-md border type-detail-medium ${
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
          className="mt-2 h-10 w-full items-center justify-center gap-1 rounded-md bg-accent/20 type-detail-medium text-secondary flex"
        >
          <Plus className="inline-block" size={16} />
          Custom Amount
        </button>
        <input
          type="number"
          placeholder="Enter custom amount"
          title="Custom donation amount"
          value={form.amount}
          onChange={(e) => updateForm({ amount: Number(e.target.value) })}
          className="mt-4 h-11 w-full rounded-md border border-input px-4 text-center type-detail outline-none focus:ring-1 focus:ring-ring"
        />

        <label className="mt-4 flex items-center justify-between rounded-md bg-muted px-4 py-3">
          <span className="type-detail-medium text-foreground">
            Pay anonymously
          </span>

          <input
            type="checkbox"
            checked={form.anonymous}
            onChange={(e) => updateForm({ anonymous: e.target.checked })}
          />
        </label>
      </div>

      <div className="mt-5 flex shrink-0 gap-3">
        <button
          onClick={closePaymentModal}
          className="h-10 flex-1 rounded-md bg-muted type-detail-small-medium text-secondary"
        >
          Back
        </button>

        <button
          onClick={nextStep}
          className="h-10 flex-1 rounded-md bg-primary type-detail-small-medium text-primary-foreground"
        >
          Generate QR
        </button>
      </div>
    </div>
  );
}
