"use client";

import { useState, useMemo } from "react";
import { Attendee } from "@/service/checkin.service";
import { CheckInTable } from "./CheckInTable";
import { CheckInSidebar } from "./CheckInSidebar";

interface CheckInTableSectionProps {
  attendees: Attendee[];
}

interface SelectedPost {
  postId: string;
  postTitle: string;
  eventStart: string | null;
  eventEnd: string | null;
}

export function CheckInTableSection({ attendees }: CheckInTableSectionProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>();

  const filteredAttendees = useMemo(() => {
    if (!selectedPostId) return attendees;
    return attendees.filter((a) => a.postId === selectedPostId);
  }, [attendees, selectedPostId]);

  const selectedPost = useMemo((): SelectedPost | undefined => {
    if (!selectedPostId) return undefined;
    const found = attendees.find((a) => a.postId === selectedPostId);
    return found
      ? {
          postId: found.postId,
          postTitle: found.postTitle,
          eventStart: found.eventStart,
          eventEnd: found.eventEnd,
        }
      : undefined;
  }, [attendees, selectedPostId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CheckInTable data={filteredAttendees} selectedPost={selectedPost} />
        </div>
        <div>
          <CheckInSidebar
            attendees={attendees}
            selectedPostId={selectedPostId}
            onSelectPost={setSelectedPostId}
          />
        </div>
      </div>
    </div>
  );
}