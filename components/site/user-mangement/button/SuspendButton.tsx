"use client";

import React from "react";
import { Button } from "../../../ui/button";

interface SuspendButtonProps {
  onClick: () => void;
}

export function SuspendButton({ onClick }: SuspendButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="px-10 py-3 h-auto rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-700 transition-colors min-w-[140px] cursor-pointer"
    >
      Suspend
    </Button>
  );
}