import React from "react";
import SurveyFeedbackFeature from "../../../../components/feedback/SurveyFeedbackCart";
import { TopBar } from "../../../../components/feedback/Top-Bar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survey Feedback",
};
export default function Page() {
  return (
    <main className="w-full bg-background">
      <TopBar />
      <SurveyFeedbackFeature />
    </main>
  );
}
