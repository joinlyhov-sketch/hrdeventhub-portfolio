"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Search, CheckCircle2, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { endorsementService } from "@/service/endorse.service";
import StepFirst from "./StepFirst";
import StepTwo from "./Step2";
import StepThree from "./Step3";
 
 
interface EndorseStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  postId?: string;
  authToken: string;
  studentName?: string;
  studentAvatar?: string;
  onSuccess?: () => void;
}

 
const AVAILABLE_SKILLS = [
  "UI Design",
  "Design System",
  "ReactJs",
  "Figma",
  "Web Accessibility",
  "Motion Design",
];
 
export default function EndorseStudentModal({
  isOpen,
  onClose,
  studentId,
  postId,
  authToken,
  studentName = "Chham Kaknika",
  studentAvatar = "https://i.pravatar.cc/150?u=kaknika",
  onSuccess,
}: EndorseStudentModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
 
  const [currentPostId, setCurrentPostId] = useState<string>(postId ?? "");
  const [sharedPostIds, setSharedPostIds] = useState<string[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isOpen || postId) return;
 
    const fetchMutualEvents = async () => {
      setIsLoadingEvents(true);
      setError(null);
      try {
        const mutualPostIds = await endorsementService.getMutualPostIds(
          studentId,
          authToken
        );
        setSharedPostIds(mutualPostIds);
      } catch (err: any) {
        setError("Unable to load shared event history. Please try again.");
        console.error("[EndorseModal] getMutualPostIds error:", err);
      } finally {
        setIsLoadingEvents(false);
      }
    };
 
    fetchMutualEvents();
  }, [isOpen, studentId, postId, authToken]);
 
  const handleNextStep = useCallback(() => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  }, [step]);
 
  const handlePrevStep = useCallback(() => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  }, [step]);

 
  const handleSubmitEndorsement = async () => {
    const finalPostId = postId ?? currentPostId;
    if (!selectedSkill || !commentText.trim() || !finalPostId) return;
 
    setIsSubmitting(true);
    setError(null);
    try {
      await endorsementService.create(
        { skill: selectedSkill, comment: commentText.trim(), studentId, postId: finalPostId },
        authToken
      );
      onSuccess?.();
      setStep(3);
    } catch (err: any) {
      setError(err?.message ?? "Failed to submit endorsement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
 
 
  const handleResetAndClose = useCallback(() => {
    setStep(1);
    setSelectedSkill(null);
    setCommentText("");
    setSearchQuery("");
    setError(null);
    if (!postId) {
      setCurrentPostId("");
      setSharedPostIds([]);
    }
    onClose();
  }, [onClose, postId]);
 
 
  const resolvedPostId = postId ?? currentPostId;
  const isNextDisabled = !selectedSkill || !resolvedPostId || isLoadingEvents;
  const isSubmitDisabled = !commentText.trim() || isSubmitting;
  const noSharedEvents = !postId && !isLoadingEvents && sharedPostIds.length === 0;
 
  const stepLabel: Record<1 | 2 | 3, string> = {
    1: "Step 1 of 3: Reference & Skill Selection",
    2: "Step 2 of 3: Add a Comment",
    3: "Step 3 of 3: Done",
  };
 
  const dialogTitle = step === 1
    ? `Endorse ${studentName.split(" ")[0]}`
    : "Add Endorsement Feedback";
 
  // ── Render ────────────────────────────────────────────────────────────────
 
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleResetAndClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-grey-900/40 backdrop-blur-xs z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-background rounded-[24px] shadow-xl border border-border z-50 overflow-hidden outline-none flex flex-col">

          <div className="bg-grey-50 border-b border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {step === 1 && (
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${studentAvatar})` }}
                />
              )}
              <div className="flex flex-col">
                <Dialog.Title className="type-subtitle text-secondary tracking-tight">
                  {dialogTitle}
                </Dialog.Title>
                <p className="type-desc-small-semibold text-primary tracking-wide mt-0.5">
                  {stepLabel[step]}
                </p>
              </div>
            </div>
            <button
              disabled={isSubmitting}
              onClick={handleResetAndClose}
              className="text-grey-400 hover:text-grey-500 p-1.5 rounded-full hover:bg-grey-100 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 flex flex-col justify-between grow">
            <div className="mb-6">
              {error && (
                <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
 
              {step === 1 && !postId && (
                <div className="mb-5 p-4 bg-grey-50 rounded-2xl border border-border">
                  <label className="block text-sm font-semibold text-secondary mb-2.5">
                    Select Shared Platform Event
                  </label>
 
                  {isLoadingEvents ? (
                    <div className="flex items-center gap-2 text-xs text-grey-400 py-2">
                      <Loader2 size={13} className="animate-spin" />
                      <span>Matching mutual registration histories...</span>
                    </div>
                  ) : noSharedEvents ? (
                    <div className="flex items-start gap-2.5 text-sm text-amber-700 bg-amber-50 p-3.5 rounded-xl border border-amber-200 font-medium">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                      <span>
                        You cannot endorse this student because you haven't both registered
                        for the same workspace events.
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={currentPostId}
                        onChange={(e) => setCurrentPostId(e.target.value)}
                        className="w-full appearance-none p-3 pr-9 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors text-sm text-secondary cursor-pointer"
                      >
                        <option value="" disabled>
                          — Choose a mutual event —
                        </option>
                        {sharedPostIds.map((pId) => (
                          <option key={pId} value={pId}>
                            Shared Event: {pId.substring(0, 8)}…
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 pointer-events-none"
                      />
                    </div>
                  )}
                </div>
              )}
 
              {step === 1 && (
                <StepFirst
                  studentName={studentName}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  availableSkills={AVAILABLE_SKILLS}
                  selectedSkill={selectedSkill}
                  setSelectedSkill={setSelectedSkill}
                />
              )}
 
              {step === 2 && (
                <StepTwo
                  studentName={studentName}
                  selectedSkill={selectedSkill}
                  commentText={commentText}
                  setCommentText={setCommentText}
                />
              )}
 
              {step === 3 && (
                <StepThree
                  studentName={studentName}
                  selectedSkill={selectedSkill}
                />
              )}
            </div>
 
            {/* ── Footer Actions ── */}
            {step === 3 ? (
              <div className="pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 bg-primary hover:opacity-95 text-white type-desc-semibold rounded-xl transition-opacity cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                {step === 2 ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePrevStep}
                    className="px-7 py-3 border border-border text-secondary type-desc-small-semibold rounded-xl hover:bg-grey-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="px-7 py-3 border border-border text-secondary type-desc-small-semibold rounded-xl hover:bg-grey-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
 
                {step === 1 ? (
                  <button
                    type="button"
                    disabled={isNextDisabled}
                    onClick={handleNextStep}
                    className="px-7 py-3 bg-primary disabled:bg-grey-200 disabled:text-grey-400 text-white type-desc-small-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitDisabled}
                    onClick={handleSubmitEndorsement}
                    className="flex items-center gap-2 px-7 py-3 bg-primary disabled:bg-grey-200 disabled:text-grey-400 text-white type-desc-small-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}