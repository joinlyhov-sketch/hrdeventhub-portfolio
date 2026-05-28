// components/site/endorsement/step3.tsx
"use client";

import React from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";

interface Step3Props {
  studentName: string;
  selectedSkill: string | null;
}

export default function Step3({ studentName, selectedSkill }: Step3Props) {
  return (
    <div className="flex flex-col items-center text-center py-4 space-y-6">
      <div className="text-subtle">
        <CheckCircle size={80} className="fill-subtle stroke-background" />
      </div>

      <div className="space-y-2">
        <h3 className="type-subtitle-24 text-subtle">Thank you!</h3>
        <p className="type-detail-medium text-grey-500 max-w-sm leading-relaxed">
          Your endorsement for <span className="type-detail-semibold text-secondary">{studentName}</span> has been successfully submitted and added to their professional profile.
        </p>
      </div>

      <div className="w-full max-w-sm bg-grey-50 border border-border rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-subtle">
            <ShieldCheck size={20} />
          </div>
          <div className="text-left">
            <p className="type-detail-small-medium font-bold text-grey-400 uppercase tracking-wider">Status</p>
            <p className="type-detail-medium text-grey-900">
              Endorsement <span className="text-subtle type-detail-semibold">Verified</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}