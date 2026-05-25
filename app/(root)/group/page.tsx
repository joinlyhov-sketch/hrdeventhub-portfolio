import GroupHeader from "../../../components/site/group/group-header";
import GroupCard from "../../../components/site/group/group-card";
import GroupSearch from "../../../components/site/group/group-search";
import { mockGroups } from "../../../data/groups";
import { Metadata } from "next";
import { BadgeInfo } from "lucide-react"; 
import { MOCK_CURRENT_USER } from "../../../data/mock-user";

export const metadata: Metadata = {
  title: "Group",
};

interface PageProps {
  searchParams: Promise<{ search?: string }> | { search?: string };
}

export default async function GroupPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.search || "";
  const userRole = MOCK_CURRENT_USER.role;

  const filteredGroups = mockGroups.filter((group) => {
    const searchLower = searchQuery.toLowerCase().trim();
    return (
      (group.title || "").toLowerCase().includes(searchLower) ||
      (group.description || "").toLowerCase().includes(searchLower) ||
      (group.type || "").toLowerCase().includes(searchLower)
    );
  });

  const hasResults = filteredGroups.length > 0;

  return (
    <div className="container mx-auto min-h-full flex mt-6 flex-col max-w-full pr-8 lg:pr-12 lg:pl-12 w-full box-border">
      <GroupHeader userRole={userRole} />

      <div className="max-w-7xl mx-auto w-full">
        <GroupSearch role={userRole} initialSearchValue={searchQuery} />
        
        <div className="relative w-full flex box-border min-h-110 mt-6">
          {hasResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full auto-rows-fr box-border">
              {filteredGroups.map((group) => (
                <div key={group.id} className="w-full block box-border min-w-0">
                  <GroupCard group={group} role={userRole} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-gray-100 box-border p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-slate-400 border border-slate-100">
                <BadgeInfo size={30} className="text-red-500" />
              </div>
              <div>
                <p className="text-base font-bold text-secondary">
                  Group doesn't exist
                </p>
                <p className="text-sm text-gray-400 font-medium">
                  We couldn't find any group match for your search.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}