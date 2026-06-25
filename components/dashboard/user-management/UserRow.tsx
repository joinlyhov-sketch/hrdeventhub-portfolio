"use client";

import React from "react";
import Link from "next/link";
import { UserRoundCheck } from "lucide-react";
import { UserData } from "../../../types/user-management-type/user";
import { TableCell, TableRow } from "../../ui/table";
import Image from "next/image";

interface UserRowProps {
  user: UserData;
  index: number;
  onEditRole: (user: UserData) => void;
  onToggleSuspend: (user: UserData) => void;
}

const formatPhoneNumber = (phone: string | undefined) => {
  if (!phone) return "N/A";
  let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");
  while (cleaned.startsWith("+855") || cleaned.startsWith("855")) {
    if (cleaned.startsWith("+855")) cleaned = cleaned.slice(4);
    else if (cleaned.startsWith("855")) cleaned = cleaned.slice(3);
  }
  if (cleaned.startsWith("+")) return "N/A";
  if (cleaned.length > 0 && !cleaned.startsWith("0")) cleaned = "0" + cleaned;
  if (/^0+$/.test(cleaned)) return "N/A";
  if (/^0\d{8,9}$/.test(cleaned)) return cleaned;
  return "N/A";
};

export default function UserRow({
  user,
  index,
  onEditRole,
  onToggleSuspend,
}: UserRowProps) {
  const isActive = user.status === "Active";
  const rowDisplayIdentifier = String(
    typeof index === "number" && !isNaN(index) ? index + 1 : 1,
  );

  const profileSrc =
    user.profilePicture && user.profilePicture.trim() !== ""
      ? user.profilePicture
      : null;

  const getGenerationNumber = (genName: string | undefined) => {
    if (!genName) return "N/A";
    const match = genName.match(/\d+/);
    return match ? match[0] : genName;
  };

  const cell =
    "px-3 py-0 h-[44px] align-middle text-lg text-gray-500 overflow-hidden whitespace-nowrap";

  return (
    <TableRow className="border-b py-3 border-gray-100 hover:bg-gray-50/50 transition-colors">
      <TableCell
        className={`${cell} text-center py-3`}
        style={{ width: "60px", minWidth: "60px", maxWidth: "60px" }}
      >
        {rowDisplayIdentifier}
      </TableCell>

      <TableCell
        className={`${cell} text-left`}
        style={{ width: "220px", minWidth: "220px", maxWidth: "220px" }}
      >
        <Link href={`/profile/${user.appUserId}`} className="flex items-center gap-2 max-w-full hover:text-primary transition-colors group cursor-pointer">
          {profileSrc ? (
            <Image
              src={profileSrc}
              alt={user.username}
              width={32}
              height={32}
              unoptimized
              className="w-8 h-8 rounded-full object-cover shrink-0 group-hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-lg font-medium text-white shrink-0 group-hover:opacity-80 transition-opacity">
              {user.firstName?.charAt(0).toUpperCase()}
              {user.lastName?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate block flex-1 min-w-0 group-hover:underline">
            {`${user.firstName} ${user.lastName}`}
          </span>
        </Link>
      </TableCell>

      <TableCell
        className={`${cell} text-left`}
        style={{ width: "280px", minWidth: "280px", maxWidth: "280px" }}
      >
        <span className="truncate block max-w-full">{user.email}</span>
      </TableCell>

      <TableCell
        className={`${cell} text-center`}
        style={{ width: "150px", minWidth: "150px", maxWidth: "150px" }}
      >
        <span className="truncate block max-w-full">
          {formatPhoneNumber(user.phoneNumber)}
        </span>
      </TableCell>

      <TableCell
        className={`${cell} text-center`}
        style={{ width: "90px", minWidth: "90px", maxWidth: "90px" }}
      >
        <span className="truncate block max-w-full">{user.gender}</span>
      </TableCell>

      <TableCell
        className={`${cell} text-center`}
        style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
      >
        <span className="truncate block max-w-full">
          {getGenerationNumber(user.generation?.name) || "N/A"}
        </span>
      </TableCell>

      <TableCell
        className={`${cell} text-center`}
        style={{ width: "120px", minWidth: "120px", maxWidth: "120px" }}
      >
        <div className="flex items-center justify-center w-full">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium justify-center ${
              isActive
                ? "bg-[#E6F9F1] text-accent"
                : "bg-[#FEECEB] text-[#EA1D24]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isActive ? "bg-accent" : "bg-[#EA1D24]"
              }`}
            />
            {user.status}
          </span>
        </div>
      </TableCell>

      <TableCell
        className={`${cell} text-center`}
        style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
      >
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={() => isActive && onEditRole(user)}
            className={`transition-colors shrink-0 ${
              isActive
                ? "text-slate-600 hover:text-blue-900 cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            }`}
          >
            <Image src="/edit.svg" alt="edit" width={20} height={20} />
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
            {isActive ? (
              <Image
                src="/user-minus.svg"
                alt="suspend"
                width={20}
                height={20}
              />
            ) : (
              <UserRoundCheck size={20} />
            )}
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
