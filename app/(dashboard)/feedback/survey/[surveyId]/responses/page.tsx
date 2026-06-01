import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Header from "../../../../../../components/dashboard/header/Header";
import SurveyResponsesView from "../../../../../../components/feedback/survey/SurveyResponsesView";
import Link from "next/link";
import { Button } from "../../../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Survey Responses | EventHub",
};

interface SurveyResponsesPageProps {
  params: {
    surveyId: string;
  };
}

export default async function SurveyResponsesPage({
  params,
}: SurveyResponsesPageProps) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Check if user has admin/organizer role (optional - backend will validate)
  const userRole = (session.user as any)?.role;
  // Note: Full permission check happens on backend

  const { surveyId } = params;

  return (
    <div className="z-20">
      <Header
        titlePrimary="Survey"
        titleSecondary="Responses"
        description="View and analyze participant responses to this survey."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 max-w-420 m-auto">
        <div className="mb-6">
          <Link href="/dashboard/feedback/survey">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={18} />
              Back to Surveys
            </Button>
          </Link>
        </div>

        <SurveyResponsesView surveyId={surveyId} />
      </main>
    </div>
  );
}
