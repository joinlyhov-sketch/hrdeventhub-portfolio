"use client";

import React from "react";
import { Button } from "../../../ui/button";

interface SuspendButtonProps {
  onClick: () => void;
}

export function SuspendButton({ onClick, ...props }: SuspendButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      {...props} 
      className="px-10 py-3 h-auto rounded-2xl bg-red-500 text-white type-desc hover:bg-red-700 transition-colors min-w-[120px] cursor-pointer"
    >
      Suspend
    </Button>
  );
}