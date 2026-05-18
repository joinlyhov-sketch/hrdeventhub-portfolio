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
            <span className="text-[#F59E0B] font-bold text-base sm:text-lg">Event</span>
            <span className="text-[#1E3A8A] font-bold text-base sm:text-lg">Management</span>
          </div>
          <p className="hidden md:block text-slate-400 text-xs">
            Manage and organize system users and their access
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-[#1E3A8A] font-bold text-sm leading-tight">Penh Seyha</p>
          <p className="text-slate-400 text-[11px]">penhseyha4980@gmail.com</p>
        </div>
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border bg-slate-200">
          <Image src="/images/user-avatar.png" alt="User" fill className="object-cover" />
        </div>
      </div>
    </div>
  </nav>
);