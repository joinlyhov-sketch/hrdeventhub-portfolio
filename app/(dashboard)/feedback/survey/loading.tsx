import Header from "@/components/dashboard/header/Header";

function SurveyListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4"
        >
          <div className="flex-1 space-y-2">
            <div
              className="h-4 bg-gray-100 rounded animate-pulse"
              style={{ width: `${45 + (i * 13) % 40}%` }}
            />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-6 bg-gray-100 rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
            <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
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
        titlePrimary="Surveys"
        titleSecondary="Management"
        description="Create, manage, and analyze survey responses from your participants."
      />
      <main className="flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 w-full max-w-475 mx-auto">
        <div className="mb-6 flex justify-end">
          <div className="h-10 w-36 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <SurveyListSkeleton />
      </main>
    </div>
  );
}
