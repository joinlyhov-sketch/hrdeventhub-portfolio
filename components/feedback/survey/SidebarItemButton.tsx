"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../libs/utils";
import { Button } from "../../ui/button";

interface SidebarItemButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  asChild?: boolean;
}

export default function SidebarItemButton({
  label,
  icon,
  className,
  asChild = false,
  ...props
}: SidebarItemButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Button
      asChild={asChild}
      variant="outline"
      className={cn(
        "w-full flex items-center justify-start gap-3 p-3 h-auto border border-gray-100 rounded-xl bg-white hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left text-sm font-medium text-gray-700",
        className,
      )}
      {...props}
    >
      <div className="text-secondary bg-blue-50/50 p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <span>{label}</span>
    </Button>
  );
}
