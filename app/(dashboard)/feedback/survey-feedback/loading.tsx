import Header from "@/components/dashboard/header/Header";

function SurveyFeedbackSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div
              className="h-4 bg-gray-100 rounded animate-pulse"
              style={{ width: `${55 + (i * 11) % 30}%` }}
            />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="z-20">
      <Header
        titlePrimary="Survey"
        titleSecondary="Feedback"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 w-full max-w-475 mx-auto">
        <SurveyFeedbackSkeleton />
      </main>
    </div>
  );
}
