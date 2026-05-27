"use client";

import { AttendeeData } from "../../../../data/AttendeeData";
import { TableCell, TableRow } from "../../../ui/table";
import ActionDropdown from "@/components/site/pop-up/action-button/ActionDropdown";
import { User, Trash2 } from "lucide-react"; 
import { DropdownAction } from "@/components/site/pop-up/action-button/ActionDropdown";
import { useRouter } from "next/navigation";

interface AttendeeRowProps {
  attendee: AttendeeData;
  onViewProfile: (attendee: AttendeeData) => void; 
  onDeleteAttendee: (id: string | number) => void;
}

export default function AttendeeRow({
  attendee,
  onDeleteAttendee,
}: AttendeeRowProps) {
  const router = useRouter();
  
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

  const rowActions: DropdownAction[] = [
    { 
      label: "View Profile", 
      icon: User, 
      onClick: () => router.push(`/profile/${attendee.no}`)
    },
    { 
      label: "Delete", 
      icon: Trash2, 
      onClick: () => onDeleteAttendee(attendee.no) 
    }
  ];

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors h-[64px]">
      <TableCell className="px-5 py-3 text-desc text-slate-500 font-bold text-center w-[5%] truncate">
        {attendee.no}
      </TableCell>

      <TableCell className="px-5 py-3 type-desc text-slate-700 font-semibold w-[18%]">
        <div className="flex items-center gap-3 truncate">
          <img
            src={attendee.avatar || "/placeholder-avatar.png"}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="truncate">{attendee.name}</span>
        </div>
      </TableCell>

      <TableCell className="px-5 py-3 text-sm text-slate-500 font-medium w-[10%] truncate">
        {attendee.gender}
      </TableCell>

      <TableCell className="px-3 py-3 text-sm text-slate-400 font-normal w-[12%] truncate">
        {attendee.timestamp}
      </TableCell>

      <TableCell className="px-8 py-3 text-sm text-desc w-[22%] text-primary truncate">
        {attendee.remark}
      </TableCell>

      <TableCell className="px-5 py-3 text-sm text-slate-500 font-medium text-center w-[10%] truncate">
        {attendee.amount.toString().startsWith("$")
          ? attendee.amount
          : `$${attendee.amount}`}
      </TableCell>

      <TableCell className="px-8 py-3 text-sm w-[12%]">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${badgeStyle.bg}`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${badgeStyle.dot}`} />
          {attendee.status}
        </span>
      </TableCell>

      <TableCell className="px-6 py-3 text-sm text-center w-[10%]">
        <ActionDropdown actions={rowActions}/>
      </TableCell>
    </TableRow>
  );
}