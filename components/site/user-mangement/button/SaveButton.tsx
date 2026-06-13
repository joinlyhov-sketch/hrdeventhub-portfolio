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
      className="px-10 py-3 h-auto rounded-2xl bg-primary text-white type-desc hover:bg-primary/90 hover:shadow-lg transition-all duration-200 min-w-[140px] cursor-pointer"
    >
      Save
    </Button>
  );
}