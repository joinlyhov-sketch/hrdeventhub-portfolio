import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Header from "../../../../../components/dashboard/header/Header";
import SurveyResponseForm from "../../../../../components/feedback/survey/SurveyResponseForm";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Survey | EventHub",
};

interface SurveyDetailPageProps {
  params: {
    surveyId: string;
  };
}

export default async function SurveyDetailPage({
  params,
}: SurveyDetailPageProps) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { surveyId } = params;

  return (
    <div className="z-20">
      <Header
        titlePrimary="Survey"
        titleSecondary="Response"
        description="Please take a moment to complete this survey."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 w-full max-w-475 mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/feedback/survey">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={18} />
              Back to Surveys
            </Button>
          </Link>
        </div>

        <SurveyResponseForm surveyId={surveyId} />
      </main>
    </div>
  );
}
