"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-modal/alert-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkill: (skill: string) => void;
}

export function AddSkillModal({
  isOpen,
  onClose,
  onAddSkill,
}: AddSkillModalProps) {
  const [skill, setSkill] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = skill.trim();

    if (!trimmed) {
      setError("Please enter a skill.");
      return;
    }

    onAddSkill(trimmed);

    setSkill("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setSkill("");
    setError("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden">
        <div className="relative border-b border-border px-8 py-6">
          <AlertDialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertDialogMedia className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
              <PlusCircle size={24} />
            </AlertDialogMedia>

            <div>
              <AlertDialogTitle className="text-2xl font-bold">
                Add New Skill
              </AlertDialogTitle>

              <AlertDialogDescription>
                Enter a skill or expertise to add to your profile.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <button
            onClick={handleClose}
            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer text-gray-400 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-6">
          <label className="block text-sm font-medium text-secondary mb-2">
            Skill
          </label>

          <input
            type="text"
            placeholder="e.g. React, Spring Boot, Docker..."
            value={skill}
            onChange={(e) => {
              setSkill(e.target.value);
              setError("");
            }}
            className="w-full h-11 px-4 border border-border rounded-xl outline-none focus:border-primary"
          />

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-8 py-4 border-t border-border bg-gray-50">
          <Button
            className="bg-white border border-gray-300 text-black hover:bg-gray-100"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit}>Add Skill</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
