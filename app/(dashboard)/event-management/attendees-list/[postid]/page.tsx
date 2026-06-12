"use client";

import React, { use, useState, useEffect } from "react";
import AttendeeTableClient from "../../../../../components/dashboard/event-management/attendee/AttendeeTable";
import AttendeesSkeleton from "../../../../../components/dashboard/event-management/attendee/AttendeesSkeleton";
import { User2 } from "lucide-react";
import { Breadcrumb } from "../../../../../components/dashboard/BreadCrumb";
import { eventService, Participant } from "@/service/event.service";
import { useSession } from "next-auth/react";

interface PageProps {
  params: Promise<{ postid: string }>;
}

export default function AttendeesManagementPage({ params }: PageProps) {
  const { postid } = use(params);
  const { data: session } = useSession();
  const [attendees, setAttendees] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAttendees() {
      try {
        const token = session?.accessToken || "";
        if (!token) return;

        const data = await eventService.getParticipants(token, postid, 1, 100);
        setAttendees(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (postid && session?.accessToken) {
      loadAttendees();
    } else if (session && !session.accessToken) {
      setIsLoading(false);
    }
  }, [postid, session]);

  return (
    <div className="w-full max-w-475 mx-auto pr-8 lg:pr-12 lg:pl-12">
      <Breadcrumb label="All attendees list" backHref="/event-management" />
      {isLoading ? (
        <AttendeesSkeleton />
      ) : (
        <div className="w-full max-w-full mx-auto my-auto p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 text-secondary border-b border-gray-50 pb-2">
            <User2 size={24} className="stroke-[2.5]" />
            <h2 className="text-xl font-bold tracking-tight">
              Registered Attendees
            </h2>
          </div>
          <AttendeeTableClient initialAttendees={attendees} />
        </div>
      )}
    </div>
  );
}
