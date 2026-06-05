import { User2 } from "lucide-react";
import UserTableClient from "@/components/dashboard/user-management/UserTable";
import { getAllUsersAction } from "@/actions/user.action";
import { ApiUser, UserData, mapApiUserToUserData } from "@/types/user-management-type/user";

export default async function UserManagementPage() {
  let initialUsers: UserData[] = [];
  
  try {
    const response: ApiUser[] = await getAllUsersAction();
    if (Array.isArray(response)) {
      initialUsers = response.map((user, index) => mapApiUserToUserData(user, index));
    }
  } catch (error) {
    console.error("Failed to load admin dashboard users:", error);
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6">
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
  );
}