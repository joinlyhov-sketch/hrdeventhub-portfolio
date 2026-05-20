"use client";

import { useState, useMemo, useEffect } from "react";
import { MoreVertical, ListFilter } from "lucide-react";

import { EventManagement } from "../../../types/event-management";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { PaginationDemo } from "../../feedback/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [events, searchTerm]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
        <Table className="w-full minimal-scrollbar">
          <TableHeader>
            <TableRow className="bg-secondary border-none">
              <TableHead className="text-white type-desc-semibold text-center w-[6%] h-12">
                No.
              </TableHead>

              <TableHead className="text-white type-desc-semibold w-[24%] text-left">
                Event Name
              </TableHead>

              <TableHead className="text-white type-desc-semibold w-[18%] text-left">
                <div className="flex items-center gap-3 cursor-pointer select-none group">
                  <span>Date</span>
                  <ListFilter size={17} />
                </div>
              </TableHead>

              <TableHead className="text-white type-desc-semibold w-[15%] text-left">
                Category
              </TableHead>

              <TableHead className="text-white type-desc-semibold w-[12%] text-left">
                <div className="flex items-center gap-3 cursor-pointer select-none group">
                  <span>Status</span>
                  <ListFilter size={17} />
                </div>
              </TableHead>

              <TableHead className="text-white type-desc-semibold text-center w-[10%]">
                Attendee
              </TableHead>

              <TableHead className="text-white type-desc-semibold text-center w-[8%]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event) => (
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
                    {event.name}
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
                    <button className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors inline-flex items-center justify-center">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-40 text-center text-gray-400 text-sm font-medium bg-slate-50/50"
                >
                  No matching events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationDemo />
    </div>
  );
}
