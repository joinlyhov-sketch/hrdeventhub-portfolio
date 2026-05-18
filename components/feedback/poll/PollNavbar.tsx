"use client";
import Image from "next/image";
import { Menu } from "lucide-react";

export const EventManagementNavbar = () => (
  <nav className="h-20 z-50 stricky top-0">
    <div className="flex items-center justify-between h-full">
      <div className="flex items-center gap-3 sm:gap-4">
        <button className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600">
          <Menu size={22} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold text-base sm:text-lg">Poll</span>
            <span className="text-action font-bold text-base sm:text-lg">Creation</span>
          </div>
          <p className="hidden md:block text-gray-500 text-xs">
            Design new poll and track participant responses for all center events.
          </p>
        </div>
      </div>
    </div>
  </nav>
);