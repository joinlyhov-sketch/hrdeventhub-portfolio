import { EventManagementClient } from "../../../components/dashboard/event-management/EventManagementClient";
import {
  eventManagementData,
  eventManagementStats,
} from "../../../data/event-management";

export default function EventManagementPage() {
  return (
    <main className="min-h-screen max-w-420 mx-auto">
      <EventManagementClient
        events={eventManagementData}
        stats={eventManagementStats}
      />
    </main>
  );
}
