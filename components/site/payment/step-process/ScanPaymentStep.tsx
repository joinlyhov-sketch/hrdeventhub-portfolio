"use client";

import { paymentEventMock } from "@/data/paymentData";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";

export default function ScanPaymentStep() {
  const { form, nextStep, prevStep } = usePaymentModalStore();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h2 className="type-desc-semibold text-foreground">Scan to pay</h2>
        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          Open your banking app and scan the QR code below
        </p>

        <div className="mt-2 rounded-xl border-2 border-accent/30 p-3 text-center">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-destructive px-3 py-1 type-detail-small-medium text-white">
              KHQR
            </span>

            <div className="text-right">
              <p className="type-detail-semibold text-primary">
                {paymentEventMock.eventName}
              </p>
              <p className="type-detail-small-medium text-muted-foreground">
                {paymentEventMock.date} · {paymentEventMock.time}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-3 flex h-[130px] w-[140px] items-center justify-center bg-muted type-title">
            QR
          </div>

          <h3 className="mt-2 type-subtitle text-foreground">
            ${form.amount.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={prevStep}
          className="h-9 flex-1 rounded-md bg-muted type-detail-small-medium text-secondary"
        >
          Back
        </button>

        <button
          onClick={nextStep}
          className="h-9 flex-1 rounded-md bg-primary type-detail-small-medium text-primary-foreground"
        >
          I’ve completed the payment{" "}
        </button>
      </div>
    </div>
  );
}
