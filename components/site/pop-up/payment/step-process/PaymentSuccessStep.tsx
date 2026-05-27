"use client";

import { paymentEventMock } from "@/data/paymentData";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import { Check } from "lucide-react";

export default function PaymentSuccessStep() {
  const { mode, form, closePaymentModal } = usePaymentModalStore();

  return (
    <div className="flex h-full flex-col justify-between text-center">
      <div>
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-white">
          <Check size={28} strokeWidth={4} />
        </div>

        <h2 className="mt-2 type-desc-semibold text-foreground">
          {mode === "register"
            ? "You’re all set!"
            : "Thank you for your donation!"}
        </h2>

        <p className="mx-auto mt-1 max-w-[300px] type-detail-small-medium leading-5 text-muted-foreground">
          {mode === "register" ? (
            <>
              Registration confirmed for{" "}
              <span className="font-semibold text-foreground">
                {form.fullName}
              </span>
              . <br />A confirmation has been sent to your email.
            </>
          ) : (
            "Your generosity makes a difference."
          )}
        </p>

        <div className="mt-3 rounded-[16px] bg-muted px-4 py-3 text-left">
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

          <div className="my-2 h-px bg-border" />

          <InfoRow label="Amount" value={`$${form.amount}`} />
          <InfoRow label="Method" value={paymentEventMock.method} />
          <InfoRow label="Ref." value={paymentEventMock.ref} />
        </div>

        <p className="mx-auto mt-6 max-w-[300px] type-detail-small-medium leading-5 text-primary">
          Thank you for registering, {form.fullName}! We look forward to seeing
          you on May 18.
        </p>
      </div>

      <div className="flex gap-4">
        {mode === "register" && (
          <button
            onClick={closePaymentModal}
            className="h-9 flex-1 rounded-md bg-muted type-detail-small-medium text-primary"
          >
            Donate more
          </button>
        )}

        <button
          onClick={closePaymentModal}
          className="h-9 flex-1 rounded-md bg-primary type-detail-small-medium text-primary-foreground"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-0.5 type-detail-small-medium">
      <span className="text-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}
