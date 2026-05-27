"use client";

import React, { useState, useMemo } from "react";
import { UserX, ListFilter, Check } from "lucide-react";
import { AttendeeData } from "../../../../data/AttendeeData";
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
  initialAttendees: AttendeeData[];
}

export default function AttendeeTableClient({
  initialAttendees,
}: AttendeeTableClientProps) {
  const [attendees, setAttendees] = useState<AttendeeData[]>(initialAttendees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const uniqueStatuses = useMemo(() => {
    const statuses = attendees.map((a) => a.status);
    return ["All", ...Array.from(new Set(statuses))];
  }, [attendees]);

  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      const matchesStatus =
        statusFilter === "All" ||
        attendee.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSearch =
        search === "" ||
        attendee.name.toLowerCase().includes(search.toLowerCase()) ||
        attendee.gender.toLowerCase().includes(search.toLowerCase()) ||
        attendee.timestamp.toLowerCase().includes(search.toLowerCase()) ||
        attendee.remark.toLowerCase().includes(search.toLowerCase()) ||
        attendee.amount.toString().includes(search) ||
        attendee.status.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
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

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-[580px] bg-white">
        <Table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b-0 h-[52px]">
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[5%]">
                No.
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-left w-[18%]">
                Name
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[10%]">
                Gender
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[12%]">
                Timestamp
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[22%]">
                Remark
              </TableHead>
              <TableHead className="px-5 py-3 text-white type-desc-semibold text-center w-[10%]">
                Amount
              </TableHead>
              <TableHead className="px-8 py-3 text-white type-desc-semibold w-[12%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-pointer select-none mx-auto w-fit bg-transparent hover:opacity-80 transition-opacity">
                      <span>Status</span>
                      <ListFilter
                        size={16}
                        className={
                          statusFilter !== "All"
                            ? "text-white fill-white"
                            : ""
                        }
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="bg-white border rounded-md shadow-md py-1 min-w-[120px]"
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
              paginatedAttendees.map((attendee) => (
                <AttendeeRow
                  key={attendee.no}
                  attendee={attendee}
                  onViewProfile={(attendee) => {
                    console.log("View profile for:", attendee);
                  }}
                  onDeleteAttendee={(id) => {
                    console.log("Delete attendee with ID:", id);
                    setAttendees((prev) =>
                      prev.filter((item) => item.no !== id),
                    );
                  }}
                />
              ))
            ) : (
              <TableRow className="hover:bg-transparent border-b-0">
                <TableCell
                  colSpan={8}
                  className="px-6 py-16 text-center h-[520px]"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-slate-400 border border-slate-100">
                      <UserX size={30} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-secondary">
                        Attendee doesn't exist
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        We couldn't find any attendees match for your search
                        parameters.
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
