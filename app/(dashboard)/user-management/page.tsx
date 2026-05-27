import {  User2 } from "lucide-react";
import UserTableClient from "../../../components/dashboard/user-management/UserTable";
import { fetchUsers } from "@/data/fetchUsers";

export default async function UserManagementPage() {
  const initialUsers = await fetchUsers();

  return (
    <div className="w-full max-w-420 mx-auto my-auto p-5 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5 text-secondary border-b border-gray-50 pb-2">
        <User2 size={24} className="stroke-[2.5]" />
        <h2 className="text-xl font-bold tracking-tight">Registered User</h2>
      </div>
      <UserTableClient initialUsers={initialUsers} />
    </div>
  );
}
