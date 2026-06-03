"use client";

import { Button } from "../../../ui/button";

interface SaveButtonProps {
  onClick: () => void;
}

export function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="px-10 py-3 h-auto rounded-2xl bg-[#1E3A8A] text-white font-bold text-sm hover:bg-blue-800 transition-colors min-w-[140px] cursor-pointer"
    >
      Save
    </Button>
  );
}