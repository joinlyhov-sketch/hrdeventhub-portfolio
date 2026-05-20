"use client";

import React, { useState } from "react";
import { Search, UserX, ListFilter } from "lucide-react";
import { AttendeeData } from "../../../../data/AttendeeData";
import { Breadcrumb } from "../../BreadCrumb";
import Pagination from "../../user-management/Pagination";
import AttendeeRow from "./AttendeeRow";

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
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for attendees"
          className="w-full pl-5 pr-14 py-3 rounded-xl border border-gray-200 outline-none placeholder:text-gray-400 focus:border-blue-900 transition-colors text-sm"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-blue-800 text-white p-2 rounded-full transition-colors shadow-sm"
        >
          <Search size={18} />
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-[580px] bg-white">
        <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <thead>
            <tr className="bg-secondary text-white h-[52px]">
              <th className="px-5 py-3 text-desc-semibold tracking-wider text-center w-[5%]">
                No.
              </th>
              <th className="px-5 py-3 text-desc-semibold tracking-wider w-[18%]">
                Name
              </th>
              <th className="px-5 py-3 text-desc-semibold tracking-wider w-[10%]">
                Gender
              </th>
              <th className="px-3 py-3 text-desc-semibold tracking-wider w-[12%]">
                Timestamp
              </th>
              <th className="px-8 py-3 text-desc-semibold tracking-wider w-[22%]">
                Remark
              </th>
              <th className="px-5 py-3 text-desc-semibold tracking-wider text-center w-[10%]">
                Amount
              </th>
              <th className="px-8 py-3 text-desc-semibold tracking-wider w-[12%]">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  Status <ListFilter size={16} />
                </div>
              </th>
              <th className="px-6 py-3 text-desc-semibold tracking-wider w-[10%]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee) => (
                <AttendeeRow
                  key={attendee.no}
                  attendee={attendee}
                  onEditRole={(a) => console.log(a)}
                  onToggleSuspend={(a) => console.log(a)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center h-[520px]">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <UserX size={22} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-700">
                        Attendee doesn't exist
                      </p>
                      <p className="text-sm text-slate-400 font-medium">
                        We couldn't find any match for your current query.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredAttendees.length > 0 && <Pagination />}
    </div>
  );
}
