import CreateArticleForm from "../../../_Component/CreateArticleForm";
import { EventManagementNavbar } from "../../../_Component/EventManagementNavbar";

export default function ArticleCreationPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans flex flex-col">
      <div className="h-full w-full sticky top-0 z-10">
        <EventManagementNavbar />
      </div>

      <main className="flex-grow w-full flex flex-col px-3 sm:px-6 lg:px-10 py-3 md:py-3 min-w-0">
        <CreateArticleForm />
      </main>
    </div>
  );
}
