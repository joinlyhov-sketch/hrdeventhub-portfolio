import GroupHeader from "../../../components/site/group/group-header";
import GroupCard from "../../../components/site/group/group-card";
import GroupSearch from "../../../components/site/group/group-search";
import { mockGroups } from "../../../data/groups";
import { Metadata } from "next";
import { UserX } from "lucide-react";
import { MOCK_CURRENT_USER } from "@/data/mock-user";

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
  const typeFilter = resolvedParams?.type || "All";
  const userRole = MOCK_CURRENT_USER.role;
  const filteredGroups = mockGroups.filter((group) => {
    const searchLower = searchQuery.toLowerCase().trim();

    const matchesSearch =
      (group.title || "").toLowerCase().includes(searchLower) ||
      (group.description || "").toLowerCase().includes(searchLower);

    const matchesType =
      typeFilter === "All" ||
      (group.type || "").toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  const hasResults = filteredGroups.length > 0;

  return (
    <div className="container mx-auto min-h-full flex mt-6 flex-col max-w-full pr-8 lg:pr-12 lg:pl-12 w-full box-border">
      <GroupHeader userRole={userRole} />

      <div className="max-w-420 mx-auto w-full">
        <GroupSearch role={userRole} initialSearchValue={searchQuery} />

        <div className="relative w-full flex box-border min-h-110">
          <div className="invisible grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4 auto-rows-fr box-border pointer-events-none">
            {mockGroups.map((group) => (
              <div
                key={`spacer-${group.id}`}
                className="w-full block box-border min-w-0"
              >
                <GroupCard group={group} role={userRole} />
              </div>
            ))}
          </div>
          {hasResults ? (
            <div className="absolute inset-0 w-full h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr box-border left-0 top-0">
              {filteredGroups.map((group) => (
                <div key={group.id} className="w-full block box-border min-w-0">
                  <GroupCard group={group} role={userRole} />
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-gray-100 box-border p-6 left-0 top-0">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <UserX size={22} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-700">
                  Data doesn&apos;t exist
                </p>
                <p className="text-sm text-slate-400 font-medium">
                  We couldn&apos;t find any match for your current query.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
