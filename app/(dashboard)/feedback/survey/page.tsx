import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Header from "../../../../components/dashboard/header/Header";
import SurveyList from "../../../../components/feedback/survey/SurveyList";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Surveys | EventHub",
};

export default async function SurveysPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }
  const workspaceId = (session.user as any)?.workspaceId || undefined;

  return (
    <div className="z-20">
      <Header
        titlePrimary="Surveys"
        titleSecondary="Management"
        description="Create, manage, and analyze survey responses from your participants."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 w-full">
        <div className="mb-6 flex justify-end">
          <Link href="/dashboard/feedback/survey/create">
            <Button className="gap-2 bg-primary">
              <Plus size={18} />
              Create Survey
            </Button>
          </Link>
        </div>

        <SurveyList workspaceId={workspaceId} showActions={true} />
      </main>
    </div>
  );
}
