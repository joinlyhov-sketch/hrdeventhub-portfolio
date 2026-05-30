"use client";
import Image from "next/image";
import { Menu } from "lucide-react";

export const UserManagementNavbar = () => (
  <nav className="h-20 z-50 sticky top-0">
    <div className="flex items-center justify-between h-full">
      <div className="flex items-center gap-3 sm:gap-4">
        <button className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600">
          <Menu size={22} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-primary font-bold text-title sm:text-lg">User</span>
            <span className="text-action font-bold text-t sm:text-lg">Management</span>
          </div>
          <p className="hidden md:block text-gray-500 text">
            Manage and organize system users and their access
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-primary font-bold text-sm leading-tight">Penh Seyha</p>
          <p className="text-primary text-[11px]">penhseyha4980@gmail.com</p>
        </div>
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border bg-slate-200">
          <Image src="/images/user-avatar.png" alt="User" fill className="object-cover" />
        </div>
      </div>
    </div>
  </nav>
);