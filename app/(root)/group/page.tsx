import GroupHeader from "../../../components/site/group/group-header";
import GroupCard from "../../../components/site/group/group-card";
import GroupSearch from "../../../components/site/group/group-search";
import { mockGroups } from "../../../data/groups";
import { MOCK_USER_ROLE } from "../../../data/mock-user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group",
};

export default async function GroupPage() {
  const groups = mockGroups;
  const userRole = MOCK_USER_ROLE;

  return (
    <div className="container mx-auto min-h-full flex mt-6 flex-col max-w-full pr-8 lg:pr-12 lg:pl-12">
      <GroupHeader userRole={userRole} />
      <GroupSearch role={userRole} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} role={userRole} />
        ))}
      </div>
    </div>
  );
}
