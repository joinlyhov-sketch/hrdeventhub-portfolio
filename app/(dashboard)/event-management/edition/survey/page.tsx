import React from "react";
import SurveyCreationForm from "@/components/feedback/survey/SurveyCreationForm";
import { FeedbackBreadcrumb } from "@/components/dashboard/FeedbackBreadcrumb";

interface PageProps {
  searchParams: Promise<{ surveyId?: string; groupId?: string }>;
}

export default async function SurveyEditPage({ searchParams }: PageProps) {
  const { surveyId } = await searchParams;

  return (
    <div className="w-full max-w-475 mx-auto pr-8 lg:pr-12 lg:pl-12">
      <FeedbackBreadcrumb label="Survey Edition" />
      <SurveyCreationForm surveyId={surveyId} /> 
    </div>
  );
}