"use client";

import { paymentEventMock } from "../../../../data/paymentData";
import { usePaymentModalStore } from "../../../../store/usePaymentStoreModal";

export default function ScanPaymentStep() {
  const { form, nextStep, prevStep } = usePaymentModalStore();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <h2 className="type-desc-semibold text-foreground">Scan to pay</h2>
        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          Open your banking app and scan the QR code below
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="rounded-xl border-2 border-accent/30 p-5 text-center">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-destructive px-4 py-1 type-detail-small-medium text-white">
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

          <div className="mx-auto mt-5 flex size-[190px] items-center justify-center bg-muted type-title">
            QR
          </div>

          <h3 className="mt-4 type-subtitle text-foreground">${form.amount}</h3>
        </div>
      </div>

      <div className="mt-5 flex shrink-0 gap-3">
        <button
          onClick={prevStep}
          className="h-10 flex-1 rounded-md bg-muted type-detail-small-medium text-secondary"
        >
          Back
        </button>

        <button
          onClick={nextStep}
          className="h-10 flex-1 rounded-md bg-primary type-detail-small-medium text-primary-foreground"
        >
          I've completed
        </button>
      </div>
    </div>
  );
}
