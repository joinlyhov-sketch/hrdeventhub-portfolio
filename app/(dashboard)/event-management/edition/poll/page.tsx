import React from "react";
import PollForm from "@/components/feedback/poll/creation/PollForm";
import { FeedbackBreadcrumb } from "@/components/dashboard/FeedbackBreadcrumb";

export default function PollEditPage() {
  return (
    <div className="w-full max-w-420 mx-auto">
      <FeedbackBreadcrumb label="Survey Creation" />
      <PollForm />
    </div>
    // <main className="p-6">
    //   <FeedbackBreadcrumb label="Poll Edition" />
    //   <div className="max-w-420 mx-auto flex flex-col lg:flex-row gap-8 items-start">
    //     <div className="flex-1 w-full">
    //
    //     </div>
    //   </div>
    // </main>
  );
}
