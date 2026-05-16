import EditEventForm from "../../../../../components/dashboard/edition/EditEventForm";
import { EventManagementNavbar } from "../../../../../components/dashboard/EventManagementNavbar";

export default function EventCreationPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans flex flex-col overflow-x-hidden">
      <div className="flex sticky top-0 z-40">
        <EventManagementNavbar />
      </div>

      <main className="flex-grow w-full flex flex-col px-3 sm:px-6 lg:px-10 py-3 md:py-3 min-w-0">
        <EditEventForm />
      </main>
    </div>
  );
}
