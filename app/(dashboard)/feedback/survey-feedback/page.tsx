import SurveyFeedbackFeature from "../../../../components/feedback/SurveyFeedbackCart";
import { Metadata } from "next";
import Header from "../../../../components/dashboard/header/Header";

export const metadata: Metadata = {
  title: "Survey Feedback",
};
export default function Page() {
  return (
    <div className="z-20">
      <Header
        titlePrimary="Survey"
        titleSecondary="Feedback"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 w-full">
        <SurveyFeedbackFeature />
      </main>
    </div>
  );
}
