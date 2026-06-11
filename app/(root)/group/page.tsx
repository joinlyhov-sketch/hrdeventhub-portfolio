import GroupHeader from "@/components/site/group/group-header";
import GroupSearch from "@/components/site/group/group-search";
import GroupList from "@/components/site/group/group-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group",
};

interface PageProps {
  searchParams:
    | Promise<{ search?: string; type?: string }>
    | { search?: string; type?: string };
}

export default async function GroupPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.search || "";
  console.log("searchQuery:", searchQuery);
  return (
    <div className="min-h-full flex mt-6 flex-col pr-8 lg:pr-12 lg:pl-12 w-full">
      <GroupHeader />

      <div className="w-full max-w-475 mx-auto">
        <GroupSearch initialSearchValue={searchQuery} />

        <GroupList />
      </div>
    </div>
  );
}
