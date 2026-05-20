"use client";

import React from "react";
import { EllipsisVertical } from "lucide-react";
import { AttendeeData } from "../../../../data/AttendeeData";

interface AttendeeRowProps {
  attendee: AttendeeData;
  onEditRole: (attendee: AttendeeData) => void;
  onToggleSuspend: (attendee: AttendeeData) => void;
}

export default function AttendeeRow({
  attendee,
  onEditRole,
  onToggleSuspend,
}: AttendeeRowProps) {
  const getStatusStyles = (status: string) => {
    const normalize = (status || "").toLowerCase().trim();

    if (normalize === "successful" || normalize === "active") {
      return {
        bg: "bg-[#E6F9F1] text-[#00B074]",
        dot: "bg-[#00B074]",
      };
    }

    if (normalize === "pending") {
      return {
        bg: "bg-[#F2F4F7] text-[#667085]",
        dot: "bg-[#667085]",
      };
    }

    return {
      bg: "bg-[#FEECEB] text-[#EA1D24]",
      dot: "bg-[#EA1D24]",
    };
  };

  const badgeStyle = getStatusStyles(attendee.status);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors h-[64px]">
      <td className="px-5 py-3 text-sm text-slate-500 font-medium text-center w-[60px] min-w-[60px] max-w-[60px] truncate">
        {attendee.no}
      </td>
      <td className="px-6 py-3 text-sm text-slate-700 font-semibold w-[220px] min-w-[220px] max-w-[220px]">
        <div className="flex items-center gap-3 truncate">
          <img
            src={attendee.avatar || "/placeholder-avatar.png"}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="truncate">{attendee.name}</span>
        </div>
      </td>
      <td className="px-6 py-3 text-sm text-slate-500 font-medium w-[120px] min-w-[120px] max-w-[120px] truncate">
        {attendee.gender}
      </td>
      <td className="px-6 py-3 text-sm text-slate-400 font-normal w-[160px] min-w-[160px] max-w-[160px] truncate">
        {attendee.timestamp}
      </td>
      <td className="px-6 py-3 text-sm text-primary text-desc w-[360px] min-w-[360px] max-w-[360px] truncate">
        {attendee.remark}
      </td>
      <td className="px-6 py-3 text-sm text-slate-500 font-medium text-center w-[130px] min-w-[130px] max-w-[130px] truncate">
        {attendee.amount.toString().startsWith("$")
          ? attendee.amount
          : `$${attendee.amount}`}
      </td>
      <td className="px-6 py-3 text-sm w-[150px] min-w-[150px] max-w-[150px]">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${badgeStyle.bg}`}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${badgeStyle.dot}`}
          />
          {attendee.status}
        </span>
      </td>
      <td className="px-6 py-3 text-sm text-center w-[80px] min-w-[80px] max-w-[80px]">
        <button
          type="button"
          onClick={() => onEditRole(attendee)}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center"
        >
          <EllipsisVertical size={18} />
        </button>
      </td>
    </tr>
  );
}
