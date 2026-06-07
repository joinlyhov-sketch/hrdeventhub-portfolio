"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useWorkspaces } from "@/hooks/use-workspaces";
import FullBigCalendar from "@/components/shadcn-big-calendar/calendar/FullBigCalendar";
import TopBar from "@/components/shadcn-big-calendar/calendar/TopBar";
import UpcomingEventSection from "@/components/shadcn-big-calendar/calendar/UpcomingEventSelection";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const role = session?.user?.role as
    | "admin"
    | "student"
    | "alumni"
    | "organizer"
    | undefined;

  const { workspaces, isLoading: workspacesLoading } = useWorkspaces(role);
  const workspaceFromUrl =
    searchParams.get("workspaceId") ||
    searchParams.get("groupId") ||
    searchParams.get("groupid");
  const workspaceId = workspaceFromUrl || workspaces[0]?.workspaceId;

  if (status === "loading" || workspacesLoading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full min-w-0 px-10 py-6">
      <TopBar />
      <div className="mx-auto m-3 w-full max-w-360 space-y-6">
        <FullBigCalendar workspaceId={workspaceId} role={role} />
        <UpcomingEventSection workspaceId={workspaceId} role={role} />
      </div>
    </main>
  );
}
