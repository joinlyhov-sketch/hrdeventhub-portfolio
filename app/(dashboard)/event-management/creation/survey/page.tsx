
import SurveyCreationForm from "@/components/feedback/survey/SurveyCreationForm";
import { FeedbackBreadcrumb } from "@/components/dashboard/FeedbackBreadcrumb";

export default async function SurveyCreationPage() {
  return (
    <div className="w-full max-w-420 mx-auto">
      <FeedbackBreadcrumb label="Survey Creation" />
      <SurveyCreationForm />
    </div>
  );
}
