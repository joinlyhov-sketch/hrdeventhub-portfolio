import AttendeeTableClient from "../../../../../components/dashboard/event-management/attendee/AttendeeTable";
import { User2 } from "lucide-react";
import { Breadcrumb } from "../../../../../components/dashboard/BreadCrumb";
import { fetchAttendees } from "@/data/fetchAttendees";


export default async function AttendeesManagementPage() {
   const initialAttendee = await fetchAttendees();

  return (
    <div className="w-full max-w-420 mx-auto">
      <Breadcrumb label="All attendees list" backHref="/event-management" />
      <div className="w-full max-w-full mx-auto my-auto p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 text-secondary border-b border-gray-50 pb-2">
          <User2 size={24} className="stroke-[2.5]" />
          <h2 className="text-xl font-bold tracking-tight">
            Registered Attendees{" "}
          </h2>
        </div>
        <AttendeeTableClient initialAttendees={initialAttendee} />
      </div>
    </div>
  );
}
