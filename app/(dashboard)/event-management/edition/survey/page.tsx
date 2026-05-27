import React from "react";
import SurveyCreationForm from "@/components/feedback/survey/SurveyCreationForm";
import { FeedbackBreadcrumb } from "@/components/dashboard/FeedbackBreadcrumb";

export default async function SurveyEditPage() {
  return (
    <div className="w-full max-w-420 mx-auto">
      <FeedbackBreadcrumb label="Survey Creation" />
      <SurveyCreationForm />
    </div>
  );
}
