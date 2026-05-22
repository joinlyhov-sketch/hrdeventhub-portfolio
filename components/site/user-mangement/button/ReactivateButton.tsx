"use client";

import React from "react";
import { Button } from "../../../ui/button";

interface ReactivateButtonProps {
  onClick: () => void;
}

export function ReactivateButton({ onClick }: ReactivateButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="px-10 py-3 h-auto rounded-2xl bg-primary text-white font-bold text-sm hover:bg-blue-800 transition-colors min-w-[140px] cursor-pointer"
    >
      Reactivate
    </Button>
  );
}