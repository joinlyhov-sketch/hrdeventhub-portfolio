"use client";

import React, { useState, useMemo, useEffect } from "react";
import { UserX, ListFilter, Check } from "lucide-react";
import { Participant } from "@/service/event.service";
import Search from "../../../site/search/Search";
import { PaginationDemo } from "@/components/feedback/Pagination";
import AttendeeRow from "./AttendeeRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/drop-down/dropdown-menu";

interface AttendeeTableClientProps {
  initialAttendees: Participant[];
}

export default function AttendeeTableClient({
  initialAttendees,
}: AttendeeTableClientProps) {
  const [attendees, setAttendees] = useState<Participant[]>(initialAttendees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("🔍 [AttendeeTableClient] Rendered with initialAttendees prop length:", initialAttendees.length);
  console.log("📊 [AttendeeTableClient] Current active internal state tracking:", attendees);

  useEffect(() => {
    console.log("🔄 [AttendeeTableClient] initialAttendees prop changed! New data:", initialAttendees);
    setAttendees(initialAttendees);
  }, [initialAttendees]);

  const uniqueStatuses = useMemo(() => {
    const statuses = attendees.map((a) => a.paymentStatus || "Free");
    return ["All", ...Array.from(new Set(statuses))];
  }, [attendees]);

  const filteredAttendees = useMemo(() => {
    const result = attendees.filter((attendee) => {
      const currentStatus = attendee.paymentStatus || "Free";
      const matchesStatus =
        statusFilter === "All" ||
        currentStatus.toLowerCase() === statusFilter.toLowerCase();

      const nameStr = attendee.appUserId || "";
      const dateStr = attendee.registeredAt || "";
      const remarkStr = attendee.remark || "";
      const searchLower = search.toLowerCase();

      const matchesSearch =
        search === "" ||
        nameStr.toLowerCase().includes(searchLower) ||
        dateStr.toLowerCase().includes(searchLower) ||
        remarkStr.toLowerCase().includes(searchLower) ||
        currentStatus.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });

    console.log(`🎯 [AttendeeTableClient] Filtering calculation complete. Matches: ${result.length} out of ${attendees.length}`);
    return result;
  }, [attendees, search, statusFilter]);

  const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);

  const paginatedAttendees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttendees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttendees, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-end mb-6 gap-2 w-full box-border">
        <Search
          value={search}
          onChange={handleSearchChange}
          placeholder="Search for attendees..."
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-145 bg-white">
        <Table className="w-full text-left border-collapse min-w-250 table-fixed">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b-0 h-13">
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[5%] ">
                No.
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-left w-[28%]">
                Name
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[15%]">
                Timestamp
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[30%]">
                Remark
              </TableHead>
              <TableHead className="px-8 py-3 text-white type-desc-semibold w-[12%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-pointer select-none mx-auto w-fit bg-transparent hover:opacity-80 transition-opacity">
                      <span>Status</span>
                      <ListFilter
                        size={16}
                        className={
                          statusFilter !== "All" ? "text-white fill-white" : ""
                        }
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="bg-white border rounded-md shadow-md py-1 min-w-30"
                  >
                    {uniqueStatuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusFilterChange(status)}
                        className="flex items-center justify-between px-3 py-2 text-sm text-secondary hover:bg-gray-100 cursor-pointer"
                      >
                        <span
                          className={
                            statusFilter === status
                              ? "font-semibold text-secondary"
                              : ""
                          }
                        >
                          {status}
                        </span>
                        {statusFilter === status && (
                          <Check size={14} className="text-secondary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="px-6 py-3 text-white type-desc-semibold text-center w-[10%]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAttendees.length > 0 ? (
              paginatedAttendees.map((attendee, index) => {
                const absoluteIndex = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <AttendeeRow
                    key={attendee.participantId}
                    indexNumber={absoluteIndex}
                    attendee={attendee}
                    onViewProfile={(item) => {
                      console.log("View profile clicked for:", item);
                    }}
                    onDeleteAttendee={(id) => {
                      console.log("Delete request triggered for entry ID:", id);
                      setAttendees((prev) =>
                        prev.filter((item) => item.participantId !== id)
                      );
                    }}
                  />
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent border-b-0">
                <TableCell colSpan={6} className="px-6 py-16 text-center h-130">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-slate-400 border border-slate-100">
                      <UserX size={30} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-secondary">
                        Attendee doesn&apos;t exist
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        We couldn&apos;t find any attendees match for your
                        search parameters.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filteredAttendees.length > 0 && (
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}