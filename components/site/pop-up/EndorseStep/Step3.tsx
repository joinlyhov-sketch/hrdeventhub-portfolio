"use client";

import { CheckCircle2,AlertTriangle,XCircle } from "lucide-react";
// Step3Props kept for potential future use
// interface Step3Props {
//   studentName: string;
//   selectedSkill: string | null;
// }
 function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}
 
 

 
function StudentAvatar({
  src,
  name,
  size = "md",
}: {
  src?: string;
  name: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  if (src) {
    return (
      <div
        className={`${dim} rounded-full bg-cover bg-center shrink-0`}
        style={{ backgroundImage: `url(${src})` }}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0`}
    >
      <span className="font-bold text-primary tracking-wide">
        {getInitials(name)}
      </span>
    </div>
  );
}
 
export default function StepSuccess({
  studentName,
  studentAvatar,
  selectedSkill,
}: {
  studentName: string;
  studentAvatar?: string;
  selectedSkill: string | null;
}) {
  const firstName = studentName.split(" ")[0];
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-5">
      <div className="relative">
        <StudentAvatar src={studentAvatar} name={studentName} size="md" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
          <CheckCircle2 size={11} className="text-white" />
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-[340px]">
        <h3 className="type-subtitle text-secondary tracking-tight">
          Endorsement Submitted!
        </h3>
        <p className="text-sm text-grey-500 leading-relaxed">
          You&apos;ve successfully endorsed{" "}
          <span className="font-semibold text-secondary">{firstName}</span> for{" "}
          <span className="font-semibold text-secondary">{selectedSkill}</span>. It
          will appear on their profile after review.
        </p>
      </div>
      <div className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
        <p className="text-xs text-green-700 font-medium text-center">
          ✓ Your endorsement has been recorded
        </p>
      </div>
    </div>
  );
}
 
export function StepFailed({
  isDuplicate,
  studentName,
  selectedSkill,
  onRetry,
}: {
  isDuplicate: boolean;
  studentName: string;
  selectedSkill: string | null;
  onRetry: () => void;
}) {
  const firstName = studentName.split(" ")[0];
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-5">
      <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center">
        {isDuplicate ? (
          <AlertTriangle size={30} className="text-amber-500" />
        ) : (
          <XCircle size={30} className="text-red-500" />
        )}
      </div>
      <div className="flex flex-col gap-2 max-w-[340px]">
        <h3 className="type-subtitle text-secondary tracking-tight">
          {isDuplicate ? "Already Endorsed" : "Submission Failed"}
        </h3>
        <p className="text-sm text-grey-500 leading-relaxed">
          {isDuplicate
            ? `You have already endorsed ${firstName} for ${selectedSkill} in this event. Each alumni can only endorse a student once per event.`
            : `Something went wrong while submitting your endorsement for ${firstName}. Please try again.`}
        </p>
      </div>
      {!isDuplicate && (
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-2.5 border border-border text-secondary text-sm font-medium rounded-xl hover:bg-grey-50 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
 