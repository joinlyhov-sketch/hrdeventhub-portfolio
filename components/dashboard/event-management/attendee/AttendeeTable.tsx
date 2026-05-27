"use client";

import React, { useState } from "react";
import { UserX, ListFilter } from "lucide-react";
import { AttendeeData } from "../../../../data/AttendeeData";
import { Breadcrumb } from "../../BreadCrumb";
import Search from "../../../site/search/Search";
import Pagination from "../../user-management/Pagination";
import AttendeeRow from "./AttendeeRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table"; 
interface AttendeeTableClientProps {
  initialAttendees: AttendeeData[];
}

export default function AttendeeTableClient({
  initialAttendees,
}: AttendeeTableClientProps) {
  const [attendees, setAttendees] = useState<AttendeeData[]>(initialAttendees);
  const [search, setSearch] = useState("");

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(search.toLowerCase()) ||
      attendee.gender.toLowerCase().includes(search.toLowerCase()) ||
      attendee.timestamp.toLowerCase().includes(search.toLowerCase()) ||
      attendee.remark.toLowerCase().includes(search.toLowerCase()) ||
      attendee.amount.toString().includes(search) ||
      attendee.status.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex items-center justify-end mb-6 gap-2 w-full box-border">
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for attendees..."
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-[580px] bg-white">
        <Table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b-0 h-[52px]">
              <TableHead className="px-5 py-3  text-desc font-bold tracking-wider text-white text-center w-[5%]">
                No.
              </TableHead>
              <TableHead className="px-5 py-3  text-desc font-bold tracking-wider text-left text-white w-[18%]">
                Name
              </TableHead>
              <TableHead className="px-5 py-3  text-desc font-bold tracking-wider text-white w-[10%]">
                Gender
              </TableHead>
              <TableHead className="px-3 py-3 text-desc font-bold tracking-wider text-white w-[12%]">
                Timestamp
              </TableHead>
              <TableHead className="px-8 py-3 text-desc font-bold tracking-wider text-white w-[22%]">
                Remark
              </TableHead>
              <TableHead className="px-5 py-3 text-desc font-bold tracking-wider text-white text-center w-[10%]">
                Amount
              </TableHead>
              <TableHead className="px-8 py-3  text-desc font-bold tracking-wider text-white w-[12%]">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  Status <ListFilter size={16} />
                </div>
              </TableHead>
              <TableHead className="px-6 py-3  text-desc font-bold tracking-wider text-white w-[10%]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee) => (
                <AttendeeRow
                  key={attendee.no}
                  attendee={attendee}
                  onViewProfile={(attendee) => {
                    console.log("View profile for:", attendee);
                  }}
                  onDeleteAttendee={(id) => {
                    console.log("Delete attendee with ID:", id);
                    setAttendees((prev) =>
                      prev.filter((item) => item.no !== id)
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
                        We couldn't find any attendees match for your search.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filteredAttendees.length > 0 && <Pagination />}
    </div>
  );
}
