"use client";

import { useState, useMemo } from "react";
import { Search, Download, ListFilter } from "lucide-react";
import { Attendee } from "@/service/checkin.service";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { PaginationDemo } from "../../feedback/Pagination";

const PHNOM_PENH_LOCALE = "en-US";
const PHNOM_PENH_TZ = "Asia/Phnom_Penh";

interface SelectedPost {
  postId: string;
  postTitle: string;
  eventStart: string | null;
  eventEnd: string | null;
}

interface CheckInTableProps {
  data: Attendee[];
  selectedPost?: SelectedPost;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "CHECKED_IN":
      return "bg-[#E6F9F1] text-accent";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "ABSENT":
      return "bg-gray-100 text-gray-500";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "CHECKED_IN":
      return "Checked In";
    case "PENDING":
      return "Pending";
    case "ABSENT":
      return "Absent";
    default:
      return status;
  }
};

const formatTime = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString(PHNOM_PENH_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: PHNOM_PENH_TZ,
  });
};

const formatEventDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(PHNOM_PENH_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: PHNOM_PENH_TZ,
  });
};

const isLate = (checkedInAt: string | null, eventStart: string | null): boolean => {
  if (!checkedInAt || !eventStart) return false;
  return new Date(checkedInAt) > new Date(eventStart);
};

export function CheckInTable({ data, selectedPost }: CheckInTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLate, setSelectedLate] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const filteredData = useMemo(() => {
    return data.filter((attendee) => {
      const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || attendee.ticketStatus === selectedStatus;

      const late = isLate(attendee.checkedInAt, attendee.eventStart);
      const matchesLate =
        selectedLate === "all" ||
        (selectedLate === "yes" && late) ||
        (selectedLate === "no" && !late);

      return matchesSearch && matchesStatus && matchesLate;
    });
  }, [data, searchTerm, selectedStatus, selectedLate]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const handleExport = () => {
    if (filteredData.length === 0) {
      alert("No attendees to export.");
      return;
    }

    const headers = [
      "No.",
      "First Name",
      "Last Name",
      "Role",
      "Status",
      "Late",
      "Check-In Time",
    ];
    const rows = filteredData.map((a, index) => {
      const late = isLate(a.checkedInAt, a.eventStart);
      return [
        index + 1,
        a.firstName,
        a.lastName,
        a.role,
        getStatusLabel(a.ticketStatus),
        late ? "Yes" : "No",
        formatTime(a.checkedInAt),
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `checkin-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-subtitle-24 font-semibold text-secondary">
          Check-In Attendees
        </h2>
      </div>

      <div className="mb-4 flex justify-between ease-in-out duration-300">
        <div className="flex items-center gap-2 flex-wrap">
          {selectedPost && (
            <>
              <div className="flex items-center rounded-[8.5px] border border-gray-300">
                <span className="text-sm font-medium bg-[#CDD4E2]/40 text-secondary py-1.5 px-3.5 rounded-[8.5px]">
                  {selectedPost.postTitle}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-[8.5px] border border-gray-200 px-3.5 py-1.5">
                <span className="text-xs text-gray-500 font-medium">
                  {formatEventDate(selectedPost.eventStart)}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-400 font-medium">
                  {formatTime(selectedPost.eventStart)}
                </span>
                <span className="text-xs text-gray-300">–</span>
                <span className="text-xs text-gray-400 font-medium">
                  {formatTime(selectedPost.eventEnd)}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Input
              placeholder="Search for attendees"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 py-2 rounded-lg border-gray-300"
            />
            <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
          </div>
          <Button
            onClick={handleExport}
            className="bg-primary hover:bg-primary-hover text-white gap-2 rounded-lg flex items-center cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="shadow-sm border border-gray-200 rounded-xl overflow-hidden w-full">
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-background type-detail-semibold text-center w-1 whitespace-nowrap px-4">
                No.
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-left whitespace-nowrap px-6 pl-14">
                Attendee
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-center w-1 whitespace-nowrap px-4">
                Role
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-center w-1 whitespace-nowrap px-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex justify-center items-center gap-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200 mx-auto">
                      <span>
                        Status{" "}
                        {selectedStatus !== "all"
                          ? `(${getStatusLabel(selectedStatus)})`
                          : ""}
                      </span>
                      <ListFilter size={15} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[150px]">
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
                        value="CHECKED_IN"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Checked In
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="PENDING"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Pending
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="ABSENT"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Absent
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-center w-1 whitespace-nowrap px-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex justify-center items-center gap-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200 mx-auto">
                      <span>
                        Late{" "}
                        {selectedLate !== "all"
                          ? `(${selectedLate === "yes" ? "Yes" : "No"})`
                          : ""}
                      </span>
                      <ListFilter size={15} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[120px]">
                    <DropdownMenuRadioGroup
                      value={selectedLate}
                      onValueChange={(val) => {
                        setSelectedLate(val);
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
                        value="yes"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Yes
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="no"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        No
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-center w-1 whitespace-nowrap px-4">
                Check-In Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((attendee, index) => {
                const late = isLate(attendee.checkedInAt, attendee.eventStart);
                return (
                  <TableRow
                    key={attendee.ticketId}
                    className="hover:bg-gray-50 border-gray-200"
                  >
                    <TableCell className="type-detail text-gray-700 text-center w-1 whitespace-nowrap px-4">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 pl-14">
                      <div className="flex items-center justify-start gap-4 max-w-[320px]">
                        {attendee.profilePicture ? (
                          <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage
                              className="bg-cover object-fill"
                              src={attendee.profilePicture}
                              alt={attendee.firstName}
                            />
                            <AvatarFallback>
                              {attendee.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#2B4372] flex items-center justify-center text-[14px] font-medium text-white shrink-0">
                            {attendee.firstName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-[16px] text-[#2C3E50] font-normal whitespace-nowrap truncate">
                          {attendee.firstName} {attendee.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="type-detail text-gray-700 text-center w-1 whitespace-nowrap px-4">
                      {attendee.role}
                    </TableCell>
                    <TableCell className="w-1 whitespace-nowrap px-6">
                      <span className="flex justify-center">
                        <span
                          className={`type-desc-small-semibold inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full ${getStatusColor(attendee.ticketStatus)}`}
                        >
                          {getStatusLabel(attendee.ticketStatus)}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="w-1 whitespace-nowrap px-6">
                      <span className="flex justify-center">
                        <span
                          className={`type-desc-small-semibold inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full ${
                            late
                              ? "bg-[#FEECEB] text-[#EA1D24]"
                              : "bg-[#E6F9F1] text-accent"
                          }`}
                        >
                          {late ? "Yes" : "No"}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm text-center w-1 whitespace-nowrap px-4">
                      <span className="type-desc-small-semibold">
                        {formatTime(attendee.checkedInAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 text-sm py-6"
                >
                  No attendees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}