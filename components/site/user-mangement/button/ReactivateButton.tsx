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
      className="px-8 py-3 h-auto rounded-2xl bg-primary text-white type-desc hover:bg-primary/90 hover:shadow-lg transition-all duration-200 min-w-[120px] cursor-pointer"
    >
      Reactivate
    </Button>
  );
}
