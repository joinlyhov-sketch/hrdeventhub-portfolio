"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Step1 from "./StepFirst";
import Step2 from "./Step2";
import Step3 from "./Step3";

interface EndorseStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentAvatar?: string;
}

const AVAILABLE_SKILLS = [
  "UI Design",
  "Design System",
  "ReactJs",
  "Figma",
  "Web Accessibility",
  "Motion Design"
];

export default function EndorseStudentModal({
  isOpen,
  onClose,
  studentName = "Chham Kaknika",
  studentAvatar = "https://i.pravatar.cc/150?u=kaknika"
}: EndorseStudentModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleNextStep = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSelectedSkill(null);
    setCommentText("");
    setSearchQuery("");
    onClose();
  };

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
                  {step === 1 ? `Endorse ${studentName.split(" ")[0]}` : "Add Endorsement Feedback"}
                </Dialog.Title>
                <p className="type-desc-small-semibold text-primary tracking-wide mt-0.5">
                  {step === 1 && "Step 1 of 3: Select a Skill"}
                  {step === 2 && "Step 2 of 3: Add a Comment"}
                  {step === 3 && "Step 3 of 3: Done"}
                </p>
              </div>
            </div>
            <button 
              onClick={handleResetAndClose}
              className="text-grey-400 hover:text-grey-500 p-1.5 rounded-full hover:bg-grey-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex flex-col justify-between grow">
            
            <div className="mb-6">
              {step === 1 && (
                <Step1 
                  studentName={studentName}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  availableSkills={AVAILABLE_SKILLS}
                  selectedSkill={selectedSkill}
                  setSelectedSkill={setSelectedSkill}
                />
              )}

              {step === 2 && (
                <Step2 
                  studentName={studentName}
                  selectedSkill={selectedSkill}
                  commentText={commentText}
                  setCommentText={setCommentText}
                />
              )}

              {step === 3 && (
                <Step3 
                  studentName={studentName}
                  selectedSkill={selectedSkill}
                />
              )}
            </div>

            {step === 3 ? (
              <div className="flex flex-col items-center w-full pt-4 border-t border-border space-y-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 bg-primary hover:opacity-95 text-white type-desc-semibold rounded-xl transition-opacity cursor-pointer shadow-xs"
                >
                  Done
                </button>
                <span className="type-detail-small-medium text-grey-400 tracking-wide">
                  Kinetic Horizon Professional Network
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-7 py-3 border border-border text-secondary type-desc-small-semibold rounded-xl hover:bg-grey-50 transition-colors cursor-pointer"
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
                    disabled={!selectedSkill}
                    onClick={handleNextStep}
                    className="px-7 py-3 bg-primary disabled:bg-grey-200 disabled:text-grey-400 text-white type-desc-small-semibold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!commentText.trim()}
                    onClick={handleNextStep}
                    className="px-7 py-3 bg-primary disabled:bg-grey-200 disabled:text-grey-400 text-white type-desc-small-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    Submit
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