import { User2 } from "lucide-react";
import UserTableClient from "@/components/dashboard/user-management/UserTable";
import { getAllUsersAction } from "@/actions/user.action";

export default async function UserManagementPage() {
  const initialUsers = await getAllUsersAction();

  return (
    <div className="w-full max-w-475 mx-auto">
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2.5 text-secondary border-b border-gray-100 pb-4">
          <User2 size={24} className="stroke-[2.5] text-slate-700" />
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Registered Users
          </h2>
        </div>
        <div className="w-full">
          <UserTableClient initialUsers={initialUsers} />
        </div>
      </div>
    </div>
  );
}
