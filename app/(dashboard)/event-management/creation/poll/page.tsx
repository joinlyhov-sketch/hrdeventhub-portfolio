import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import PollForm from "@/components/feedback/poll/PollForm";
import { FeedbackBreadcrumb } from "@/components/dashboard/FeedbackBreadcrumb";

export default async function PollCreatePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <main className="w-full max-w-475 mx-auto">
      <FeedbackBreadcrumb label="Poll Creation" />
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <PollForm />
        </div>
      </div>
    </main>
  );
}
