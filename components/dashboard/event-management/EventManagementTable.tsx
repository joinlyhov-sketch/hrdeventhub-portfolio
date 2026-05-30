"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ListFilter, Pencil, Trash2, XCircle, UserX } from "lucide-react";
import { EventManagement } from "../../../types/event-management";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";
import { PaginationDemo } from "../../feedback/Pagination";
import Link from "next/link";
import ActionDropdown, {
  DropdownAction,
} from "@/components/site/pop-up/action-button/ActionDropdown";

interface EventManagementTableProps {
  events: EventManagement[];
  searchTerm: string;
}

const getStatusStyles = (status: string): string => {
  switch (status) {
    case "Published":
      return "bg-[#FFF4E5] text-[#FF9F1C]";
    case "Draft":
      return "bg-[#EBF3FF] text-[#1D4ED8]";
    case "Cancel":
      return "bg-[#FEE2E2] text-[#EF4444]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function EventManagementTable({
  events,
  searchTerm,
}: EventManagementTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const itemsPerPage = 10;

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || event.status === selectedStatus;

      let matchesDate = true;
      if (selectedDateRange !== "all" && event.date) {
        const eventDate = new Date(event.date);
        const now = new Date();

        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const diffTime = today.getTime() - eventDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (selectedDateRange === "today") {
          matchesDate = eventDate.toDateString() === today.toDateString();
        } else if (selectedDateRange === "yesterday") {
          matchesDate = eventDate.toDateString() === yesterday.toDateString();
        } else if (selectedDateRange === "7days") {
          matchesDate = diffDays >= 0 && diffDays <= 7;
        } else if (selectedDateRange === "30days") {
          matchesDate = diffDays >= 0 && diffDays <= 30;
        } else if (selectedDateRange === "thisMonth") {
          matchesDate =
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear();
        } else if (selectedDateRange === "lastMonth") {
          const lastMonthTarget =
            now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear =
            now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          matchesDate =
            eventDate.getMonth() === lastMonthTarget &&
            eventDate.getFullYear() === lastMonthYear;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [events, searchTerm, selectedStatus, selectedDateRange]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const handleDeleteRequest = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      console.log(`Deleting event with ID: ${id}`);
    }
  };

  const handleCancelRequest = (id: string) => {
    if (confirm("Are you sure you want to cancel this event?")) {
      console.log(`Canceling event with ID: ${id}`);
    }
  };

  const dateLabels: Record<string, string> = {
    all: "Date",
    today: "Today",
    yesterday: "Yesterday",
    "7days": "Last 7 Days",
    "30days": "Last 30 Days",
    thisMonth: "This Month",
    lastMonth: "Last Month",
  };

  return (
    <div className="space-y-6">
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-[580px] bg-white">
        <Table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b-0 h-[52px]">
              <TableHead className="px-5 py-3 text-center text-white type-desc-semibold w-[6%]">
                No.
              </TableHead>

              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[24%]">
                Event Name
              </TableHead>

              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[18%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        {selectedDateRange === "all"
                          ? "Date"
                          : dateLabels[selectedDateRange]}
                      </span>
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[150px]">
                    <DropdownMenuRadioGroup
                      value={selectedDateRange}
                      onValueChange={(val) => {
                        setSelectedDateRange(val);
                        setCurrentPage(1);
                      }}
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        All
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="today"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Today
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="yesterday"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Yesterday
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="7days"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Last 7 days
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="30days"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Last 30 days
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="thisMonth"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        This Month
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="lastMonth"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Last Month
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>

              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[15%]">
                Category
              </TableHead>

              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[15%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        Status{" "}
                        {selectedStatus !== "all" ? `(${selectedStatus})` : ""}
                      </span>
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[130px]">
                    <DropdownMenuRadioGroup
                      value={selectedStatus}
                      onValueChange={(val) => {
                        setSelectedStatus(val);
                        setCurrentPage(1);
                      }}
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        All
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Published"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Published
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Draft"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Draft
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Cancel"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Cancel
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>

              <TableHead className="px-5 py-3 text-center text-white type-desc-semibold w-[12%]">
                Attendee
              </TableHead>

              <TableHead className="px-5 py-3 text-center text-white type-desc-semibold w-[10%]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => {
                const currentItemActions: DropdownAction[] = [
                  {
                    label: "Update",
                    icon: Pencil,
                    onClick: () =>
                      router.push(`/event-management/edition/event`),
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    onClick: () => handleDeleteRequest(event.id),
                  },
                  {
                    label: "Cancel",
                    icon: XCircle,
                    onClick: () => handleCancelRequest(event.id),
                  },
                ];

                return (
                  <TableRow
                    key={event.id}
                    className="hover:bg-gray-50/80 border-b border-gray-100 h-14"
                  >
                    <TableCell className="text-center text-secondary type-desc">
                      {event.no}
                    </TableCell>

                    <TableCell
                      title={event.name}
                      className="max-w-[140px] truncate text-left text-primary type-desc cursor-pointer"
                    >
                      <Link
                        href={`/event-management/attendees-list/${event.id}`}
                        className="hover:underline"
                      >
                        {event.name}
                      </Link>
                    </TableCell>

                    <TableCell
                      title={event.date}
                      className="max-w-[140px] truncate text-left text-gray-500 type-desc"
                    >
                      {event.date}
                    </TableCell>

                    <TableCell
                      title={event.category}
                      className="max-w-[120px] truncate text-left text-gray-500 type-desc"
                    >
                      {event.category || "-"}
                    </TableCell>

                    <TableCell className="text-left">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full type-desc-small-semibold font-bold whitespace-nowrap ${getStatusStyles(
                          event.status,
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {event.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-center text-secondary type-desc">
                      {event.attendees !== null && event.attendees !== undefined
                        ? event.attendees.toLocaleString()
                        : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      <ActionDropdown actions={currentItemActions} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent border-b-0">
                <TableCell
                  colSpan={7}
                  className="px-6 py-16 text-center h-[520px]"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-slate-400 border border-slate-100">
                      <UserX size={30} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-secondary">
                        Event doesn&apos;t exist
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        We couldn&apos;t find any events match for your search.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredEvents.length > 0 && (
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
