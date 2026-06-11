import CreateEventForm from "@/components/dashboard/creation/CreateEventForm";

export default function EventCreationPage() {
  return (
    <main className="grow flex flex-col w-full max-w-475 mx-auto pr-8 lg:pr-12 lg:pl-12">
      <CreateEventForm />
    </main>
  );
}
