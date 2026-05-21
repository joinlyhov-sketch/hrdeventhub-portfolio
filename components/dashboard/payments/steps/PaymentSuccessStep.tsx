"use client";

import { Check } from "lucide-react";
import { paymentEventMock } from "../../../../data/paymentData";
import { usePaymentModalStore } from "../../../../store/usePaymentStoreModal";

export default function PaymentSuccessStep() {
  const { mode, form, closePaymentModal } = usePaymentModalStore();

  return (
    <div className="flex h-full min-h-0 flex-col text-center">
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent text-white">
          <Check size={34} />
        </div>

        <h2 className="mt-5 type-desc-semibold text-foreground">
          {mode === "register"
            ? "You're all set!"
            : "Thank you for your donation!"}
        </h2>

        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          {mode === "register"
            ? `Registration confirmed for ${form.fullName}.`
            : "Your generosity makes a difference."}
        </p>

        <div className="mt-6 rounded-lg bg-muted p-4 text-left">
          <InfoRow label="Event" value={paymentEventMock.eventName} />
          <InfoRow label="Date" value={paymentEventMock.date} />
          <InfoRow
            label={mode === "register" ? "Attendee" : "Donor"}
            value={
              mode === "donation" && form.anonymous
                ? "Anonymous"
                : form.fullName
            }
          />
          <InfoRow label="Amount" value={`$${form.amount}`} />
          <InfoRow label="Method" value={paymentEventMock.method} />
          <InfoRow label="Ref." value={paymentEventMock.ref} />
        </div>
      </div>

      <div className="mt-5 flex shrink-0 gap-3">
        {mode === "register" && (
          <button
            onClick={closePaymentModal}
            className="h-10 flex-1 rounded-md bg-muted type-detail-small-medium text-secondary"
          >
            Donate more
          </button>
        )}

        <button
          onClick={closePaymentModal}
          className="h-10 flex-1 rounded-md bg-primary type-detail-small-medium text-primary-foreground"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 type-detail-small-medium">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}
