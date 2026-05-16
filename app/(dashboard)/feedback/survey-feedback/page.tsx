import React from "react";
import { Search, Plus, User, BarChart3 } from "lucide-react";
import { surveyFeedbacks } from "../../../../data/surveyFeedback";
import SurveyFeedbackFeature from "../../../../components/feedback/SurveyFeedbackCart";
import { PaginationSimple } from ".";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-6">
        <div>
          <h1 className="type-title text-primary">
            Survey <span className="text-action">Feedback</span>
          </h1>

          <p className="type-desc mt-2 max-w-2xl text-muted-foreground">
            Monitor participant responses and review insights from completed
            community surveys.
          </p>
        </div>

        <div className="rounded-xl bg-card px-5 py-3 text-right">
          <h3 className="type-desc-semibold text-primary">Dita Rector</h3>

          <p className="type-detail-medium mt-1 text-primary-hover">
            rectordita@gmail.com
          </p>
        </div>
      </header>
      <SurveyFeedbackFeature />
      <PaginationSimple />
    </main>
  );
}
