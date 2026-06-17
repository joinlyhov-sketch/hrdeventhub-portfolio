import Header from "../../../components/dashboard/header/Header";
import { CheckInTableSection } from "@/components/site/checkin/CheckInTableSection";
import { checkinService, Attendee } from "@/service/checkin.service";
import { workspaceService } from "@/service/workspace.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function CheckInPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || "";
  const role = session?.user?.role || "student";

  let attendees: Attendee[] = [];

  try {
    if (token) {
      const response = await checkinService.getAllAttendees(token, 1, 200);
      const allAttendees = response.payload;

      if (role === "organizer") {
        const organizerWorkspaces = await workspaceService.getMyWorkspaces(token);
        const organizerWorkspaceIds = new Set(organizerWorkspaces.map((w) => w.id));
        attendees = allAttendees.filter((a) =>
          organizerWorkspaceIds.has(a.workspaceId),
        );
      } else {
        attendees = allAttendees;
      }
    }
  } catch (error) {
    console.error("Failed to fetch check-in data:", error);
  }

  return (
    <main className="min-h-screen z-10">
      <Header
        titlePrimary="Check-In"
        titleSecondary="Management"
        description="Monitor attendee check-ins and review insights from your events."
      />
      <div className="w-full min-w-0 max-w-475 mx-auto pr-8 lg:pr-12 lg:pl-12">
        <CheckInTableSection attendees={attendees} />
      </div>
    </main>
  );
}