import { EventManagementClient } from "../../../../components/dashboard/event-management/EventManagementClient";
import {
  eventManagementData,
  eventManagementStats,
} from "../../../../data/event-management";

export default function EventManagementPage() {
  return (
    <main className="min-h-screen">
      <div className="px-2 py-8 w-full">
        <EventManagementClient
          events={eventManagementData}
          stats={eventManagementStats}
        />
      </div>
    </main>
  );
}
