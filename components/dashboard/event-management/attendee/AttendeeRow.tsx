"use client";

import { Participant } from "@/service/event.service";
import { TableCell, TableRow } from "../../../ui/table";
import ActionDropdown from "@/components/site/pop-up/action-button/ActionDropdown";
import { User, Trash2 } from "lucide-react"; 
import { DropdownAction } from "@/components/site/pop-up/action-button/ActionDropdown";
import { useRouter } from "next/navigation";

interface AttendeeRowProps {
  attendee: Participant;
  indexNumber: number;
  onViewProfile: (attendee: Participant) => void; 
  onDeleteAttendee: (id: string) => void;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${day} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

export default function AttendeeRow({
  attendee,
  indexNumber,
  onDeleteAttendee,
}: AttendeeRowProps) {
  const router = useRouter();
  const getStatusStyles = (status: string) => {
    const normalize = (status || "").toLowerCase().trim();

    if (normalize === "successful" || normalize === "active" || normalize === "free") {
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

  const badgeStyle = getStatusStyles(attendee.paymentStatus);

  const rowActions: DropdownAction[] = [
    { 
      label: "View Profile", 
      icon: User, 
      onClick: () => router.push(`/profile/${attendee.participantId}`)
    },
    { 
      label: "Delete", 
      icon: Trash2, 
      onClick: () => onDeleteAttendee(attendee.participantId) 
    }
  ];

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors h-[64px]">
      <TableCell className="px-1 py-3 type-desc text-slate-500 font-bold text-center w-[5%] truncate">
        {indexNumber}
      </TableCell>

      <TableCell className="px-5 py-3 type-desc text-slate-700 font-semibold w-[28%]">
        <div className="flex items-center gap-3 truncate">
          <img
            src="/placeholder-avatar.png"
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="truncate">{attendee.appUserId}</span>
        </div>
      </TableCell>

      <TableCell className="px-3 py-3 type-desc text-slate-400 font-normal w-[15%] text-center truncate">
        {formatDate(attendee.registeredAt)}
      </TableCell>

      <TableCell className="px-1 py-3 type-desc w-[30%] text-primary truncate">
        {attendee.remark || "-"}
      </TableCell>

      <TableCell className="px-2 py-3 type-desc w-[12%] text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${badgeStyle.bg}`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${badgeStyle.dot}`} />
          {attendee.paymentStatus}
        </span>
      </TableCell>

      <TableCell className="px-6 py-3 type-desc text-center w-[10%]">
        <ActionDropdown actions={rowActions}/>
      </TableCell>
    </TableRow>
  );
}