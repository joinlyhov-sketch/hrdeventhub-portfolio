import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Header from "../../../../../components/dashboard/header/Header";
import SurveyCreationForm from "../../../../../components/feedback/survey/SurveyCreationForm";

export const metadata: Metadata = {
  title: "Create Survey | EventHub",
};

export default async function CreateSurveyPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="z-20">
      <Header
        titlePrimary="Create"
        titleSecondary="Survey"
        description="Design and create a new survey for your participants."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 w-full">
        <SurveyCreationForm />
      </main>
    </div>
  );
}
