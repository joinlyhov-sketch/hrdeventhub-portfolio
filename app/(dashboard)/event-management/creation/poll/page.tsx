import React from "react";
import PollForm from "@/components/feedback/poll/creation/PollForm";
import { FeedbackBreadcrumb } from "@/components/dashboard/FeedbackBreadcrumb";

export default function PollCreatePage() {
  return (
    <main className="p-6">
      <FeedbackBreadcrumb label="Poll Creation" />
      <div className="max-w-420 mx-auto flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <PollForm />
        </div>
      </div>
    </main>
  );
}
