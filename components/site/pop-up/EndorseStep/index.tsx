"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  CheckCircle2,
  ChevronDown,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { endorsementService } from "@/service/endorse.service";
import StepTwo from "./Step2";
import StepSuccess, { StepFailed } from "./Step3";
import StepFirst from "./StepFirst";
import { RegistrationPayloadItem } from "@/types/endorsement";

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

type SubmitResult = "success" | "error" | "duplicate" | null;

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function getEventLabel(reg: RegistrationPayloadItem): string {
  if (reg.post?.title?.trim()) {
    return reg.post.title.trim();
  }

  return `Event ${reg.postId.substring(0, 8)}…`;
}

interface EventDropdownProps {
  registrations: RegistrationPayloadItem[];
  selectedPostId: string;
  onSelect: (postId: string) => void;
  disabled?: boolean;
}

function EventDropdown({
  registrations,
  selectedPostId,
  onSelect,
  disabled,
}: EventDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedReg = registrations.find((reg) => reg.postId === selectedPostId);

  const filtered = registrations.filter((reg) =>
    getEventLabel(reg).toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          disabled={disabled}
          placeholder={
            selectedReg
              ? getEventLabel(selectedReg)
              : "Search or select an event…"
          }
          value={isOpen ? query : selectedReg ? getEventLabel(selectedReg) : ""}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setQuery("");
            setIsOpen(true);
          }}
          className="w-full h-[46px] pl-10 pr-10 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors text-sm text-secondary placeholder:text-grey-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <ChevronDown
          onClick={() => !disabled && setIsOpen((open) => !open)}
          className={`absolute right-3.5 text-grey-400 cursor-pointer select-none transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 bg-background border border-border rounded-xl shadow-xl max-h-[200px] overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="text-sm text-grey-400 px-4 py-3 text-center">
              No matching events found.
            </div>
          ) : (
            filtered.map((reg) => {
              const active = reg.postId === selectedPostId;

              return (
                <div
                  key={reg.postId}
                  onClick={() => {
                    onSelect(reg.postId);
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                    active
                      ? "bg-primary/5 text-primary font-medium"
                      : "text-secondary hover:bg-grey-50"
                  }`}
                >
                  <span className="truncate">{getEventLabel(reg)}</span>

                  {active && (
                    <CheckCircle2
                      size={14}
                      className="text-primary shrink-0 ml-2"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
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

export default function EndorseStudentModal({
  isOpen,
  onClose,
  studentId,
  postId,
  authToken,
  studentName = "Student",
  studentAvatar,
  onSuccess,
}: EndorseStudentModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [skillQuery, setSkillQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const [currentPostId, setCurrentPostId] = useState<string>(postId ?? "");
  const [sharedRegistrations, setSharedRegistrations] = useState<
    RegistrationPayloadItem[]
  >([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const [isDuplicate, setIsDuplicate] = useState(false);
  const isCheckingDuplicate = false;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult>(null);

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || postId) return;

    const fetchMutualEvents = async () => {
      setIsLoadingEvents(true);
      setFetchError(null);

      try {
        const regs = await endorsementService.getMutualRegistrations(
          studentId,
          authToken
        );

        setSharedRegistrations(regs);
      } catch (error: unknown) {
        setFetchError("Unable to load shared event history. Please try again.");
        console.error("[EndorseModal] getMutualRegistrations error:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchMutualEvents();
  }, [isOpen, studentId, postId, authToken]);

  useEffect(() => {
    if (postId) {
      setCurrentPostId(postId);
    }
  }, [postId]);

  const handleNextStep = useCallback(() => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  }, [step]);

  const handlePrevStep = useCallback(() => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  }, [step]);

  const handleSubmitEndorsement = async () => {
    const finalPostId = postId ?? currentPostId;

    if (!selectedSkill || !commentText.trim() || !finalPostId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      await endorsementService.create(
        {
          skill: selectedSkill,
          comment: commentText.trim(),
          studentId,
          postId: finalPostId,
        },
        authToken
      );

      setSubmitResult("success");
      setStep(3);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 100);
      }
    } catch (error: unknown) {
      console.error("[EndorseModal] Submission error caught:", error);

      const errorRecord = error as Record<string, unknown>;
      const message =
        typeof errorRecord?.message === "string"
          ? errorRecord.message
          : typeof error === "string"
            ? error
            : "";

      const status = errorRecord?.status;

      const duplicate =
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("duplicate") ||
        status === 409;

      setSubmitResult(duplicate ? "duplicate" : "error");
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = useCallback(() => {
    setStep(1);
    setSelectedSkill(null);
    setCommentText("");
    setSkillQuery("");
    setFetchError(null);
    setSubmitResult(null);
    setIsDuplicate(false);
    setIsSubmitting(false);

    if (!postId) {
      setCurrentPostId("");
      setSharedRegistrations([]);
    }

    onClose();
  }, [onClose, postId]);

  const handleRetryFromFailed = useCallback(() => {
    setSubmitResult(null);
    setStep(2);
  }, []);

  const resolvedPostId = postId ?? currentPostId;

  const noSharedEvents =
    !postId &&
    !isLoadingEvents &&
    sharedRegistrations.length === 0 &&
    !fetchError;

  const isNextDisabled =
    !selectedSkill ||
    !resolvedPostId ||
    isLoadingEvents ||
    isCheckingDuplicate ||
    isDuplicate;

  const isSubmitDisabled = !commentText.trim() || isSubmitting;

  const stepLabel: Record<1 | 2 | 3, string> = {
    1: "Step 1 of 3 — Event & Skill",
    2: "Step 2 of 3 — Add Comment",
    3:
      submitResult === "success"
        ? "Step 3 of 3 — Complete"
        : "Step 3 of 3 — Result",
  };

  const dialogTitle =
    step === 3
      ? submitResult === "success"
        ? "Endorsement Complete"
        : "Endorsement Failed"
      : step === 1
        ? `Endorse ${studentName.split(" ")[0]}`
        : "Add Endorsement Feedback";

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleResetAndClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-grey-900/40 backdrop-blur-xs z-50" />

        <Dialog.Content
          onPointerDownOutside={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-background rounded-[24px] shadow-xl border border-border z-50 overflow-hidden outline-none flex flex-col"
        >
          <div className="bg-grey-50 border-b border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {step !== 3 && (
                <StudentAvatar
                  src={studentAvatar}
                  name={studentName}
                  size="md"
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
              {step === 1 && (
                <>
                  {fetchError && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <span>{fetchError}</span>
                    </div>
                  )}

                  {isDuplicate && !isCheckingDuplicate && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium border border-amber-200">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <span>
                        You&apos;ve already endorsed this student for this
                        event. Select a different event to continue.
                      </span>
                    </div>
                  )}

                  {!postId && (
                    <div className="mb-5 p-4 bg-grey-50 rounded-2xl border border-border">
                      <label className="block text-sm font-semibold text-secondary mb-2.5">
                        Select Shared Event
                      </label>

                      {isLoadingEvents ? (
                        <div className="flex items-center gap-2 text-xs text-grey-400 py-2">
                          <Loader2 size={13} className="animate-spin" />
                          <span>Matching mutual registration histories…</span>
                        </div>
                      ) : noSharedEvents ? (
                        <div className="flex items-start gap-2.5 text-sm text-amber-700 bg-amber-50 p-3.5 rounded-xl border border-amber-200 font-medium">
                          <AlertTriangle
                            size={15}
                            className="shrink-0 mt-0.5"
                          />
                          <span>
                            You cannot endorse this student — you haven&apos;t
                            both registered for the same workspace events.
                          </span>
                        </div>
                      ) : (
                        <>
                          <EventDropdown
                            registrations={sharedRegistrations}
                            selectedPostId={currentPostId}
                            onSelect={setCurrentPostId}
                            disabled={isLoadingEvents}
                          />

                          {isCheckingDuplicate && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-grey-400">
                              <Loader2 size={11} className="animate-spin" />
                              <span>Checking eligibility…</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <StepFirst
                    studentName={studentName}
                    skillQuery={skillQuery}
                    setSkillQuery={setSkillQuery}
                    selectedSkill={selectedSkill}
                    setSelectedSkill={setSelectedSkill}
                  />
                </>
              )}

              {step === 2 && (
                <StepTwo
                  studentName={studentName}
                  selectedSkill={selectedSkill}
                  commentText={commentText}
                  setCommentText={setCommentText}
                />
              )}

              {step === 3 && submitResult === "success" && (
                <StepSuccess
                  studentName={studentName}
                  studentAvatar={studentAvatar}
                  selectedSkill={selectedSkill}
                />
              )}

              {step === 3 &&
                (submitResult === "error" || submitResult === "duplicate") && (
                  <StepFailed
                    isDuplicate={submitResult === "duplicate"}
                    studentName={studentName}
                    selectedSkill={selectedSkill}
                    onRetry={handleRetryFromFailed}
                  />
                )}
            </div>

            {step === 3 ? (
              <div className="pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className={`w-full py-3.5 text-white type-desc-semibold rounded-xl transition-opacity cursor-pointer shadow-xs ${
                    submitResult === "success"
                      ? "bg-primary hover:opacity-95"
                      : "bg-grey-700 hover:opacity-90"
                  }`}
                >
                  {submitResult === "success" ? "Done" : "Close"}
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
                    {isSubmitting && (
                      <Loader2 size={14} className="animate-spin" />
                    )}

                    {isSubmitting ? "Submitting…" : "Submit"}
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