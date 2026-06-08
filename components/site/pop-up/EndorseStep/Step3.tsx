"use client";

import { CheckCircle2 } from "lucide-react";
interface Step3Props {
  studentName: string;
  selectedSkill: string | null;
}
 
export default function StepThree({ studentName, selectedSkill }: Step3Props) {
  const firstName = studentName.split(" ")[0];
 
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
      <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="type-subtitle text-secondary tracking-tight">
          Endorsement Submitted!
        </h3>
        <p className="text-sm text-grey-500 leading-relaxed max-w-[340px]">
          You've successfully endorsed{" "}
          <span className="font-semibold text-secondary">{firstName}</span> for{" "}
          <span className="font-semibold text-secondary">{selectedSkill}</span>. This
          will appear on their profile after review.
        </p>
      </div>
    </div>
  );
}
 