"use client";

import React from "react";

interface SidebarItemButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function SidebarItemButton({ label, icon, onClick }: SidebarItemButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left text-sm font-medium text-gray-700"
    >
      <div className="text-secondary bg-blue-50/50 p-1.5 rounded-lg flex-shrink-0">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}