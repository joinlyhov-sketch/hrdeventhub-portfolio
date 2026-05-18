import React from "react";
import SurveyCreationForm from "../../../../../components/feedback/survey/SurveyCreationForm";
import { FeedbackBreadcrumb } from "../../../../../components/dashboard/FeedbackBreadcrumb";

export default async function SurveyCreationPage() {
  return (
    <div className="w-full">
      <FeedbackBreadcrumb label="Survey Creation" />
      <SurveyCreationForm />
    </div>
  );
}
