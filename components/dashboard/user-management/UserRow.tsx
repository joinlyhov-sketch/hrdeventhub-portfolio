"use client";

import React from "react";
import { SquarePen, UserX2, UserRoundCheck } from "lucide-react";
import { UserData } from "../../../data/UserData";
import { TableCell, TableRow } from "../../ui/table";

interface UserRowProps {
  user: UserData;
  onEditRole: (user: UserData) => void;
  onToggleSuspend: (user: UserData) => void;
}

export default function UserRow({
  user,
  onEditRole,
  onToggleSuspend,
}: UserRowProps) {
  const isActive = user.status === "Active";

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors h-[56px]">
      <TableCell className="px-5 py-3 text-desc text-gray-500 text-center w-[5%] truncate">
        {user.no}
      </TableCell>

      <TableCell className="px-6 py-3 text-desc text-gray-500 w-[18%]">
        <div className="flex items-center gap-3 truncate">
          <img
            src={user.avatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="truncate">{user.username}</span>
        </div>
      </TableCell>

      <TableCell className="px-5 py-3 text-desc text-gray-500 w-[20%] truncate text-center">
        {user.email}
      </TableCell>

      <TableCell className="px-6 py-3 text-desc text-gray-500 w-[13%] truncate text-center">
        {user.phone}
      </TableCell>

      <TableCell className="px-6 py-3 text-desc text-gray-500 w-[10%] truncate text-center">
        {user.gender}
      </TableCell>

      <TableCell className="px-1 py-3 text-desc text-gray-500 text-center w-[10%] truncate">
        {user.gen}
      </TableCell>

      <TableCell className="px-1 py-3 text-desc text-gray-500 text-center w-[15%]">
        <div className="flex items-center justify-center w-full">
          <span
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 min-w-[90px] ${
              isActive
                ? "bg-[#E6F9F1] text-accent"
                : "bg-[#FEECEB] text-[#EA1D24]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-accent" : "bg-[#EA1D24]"}`}
            />
            {user.status}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-8 py-3 text-sm w-[10%] text-left">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onEditRole(user)}
            className="text-slate-600 hover:text-blue-900 transition-colors cursor-pointer shrink-0"
          >
            <SquarePen size={18} />
          </button>
          <button
            type="button"
            onClick={() => onToggleSuspend(user)}
            className={`transition-colors cursor-pointer shrink-0 ${
              isActive
                ? "text-[#EA1D24] hover:text-red-700"
                : "text-accent hover:text-green-700"
            }`}
          >
            {isActive ? <UserX2 size={18} /> : <UserRoundCheck size={18} />}
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
