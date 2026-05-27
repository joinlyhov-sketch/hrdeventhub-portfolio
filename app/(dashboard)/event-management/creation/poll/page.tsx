import React from "react";
import { ChevronRight } from "lucide-react";
import PollForm from "../../../../../components/feedback/poll/creation/PollForm";
import PollSidebar from "../../../../../components/feedback/poll/creation/PollSidebar";

export default function PollCreatePage() {
  return (
    <main className="p-6">
      <div className="max-w-420 mx-auto flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <PollForm />
        </div>
        {/* <aside className=" h-full sticky top-24">
          <PollSidebar />
        </aside> */}
      </div>
    </main>
  );
}
