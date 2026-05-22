"use client";

import React, { useState } from "react";
import { UserX, ListFilter, ArrowUp } from "lucide-react";
import Search from "../../site/search/Search";
import UserRow from "./UserRow";
import Pagination from "./Pagination";
import EditRoleModal from "../pop-up/user-management-pop-up/EditRoleModal";
import SuspendModal from "../pop-up/user-management-pop-up/SuspendModal";
import ReactivateModal from "../pop-up/user-management-pop-up/ReactivateModal";
import { UserData } from "../../../data/UserData";

interface UserTableClientProps {
  initialUsers: UserData[];
}

export default function UserTableClient({
  initialUsers,
}: UserTableClientProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState("");

  const [selectedUserForRole, setSelectedUserForRole] =
    useState<UserData | null>(null);
  const [selectedUserForSuspend, setSelectedUserForSuspend] =
    useState<UserData | null>(null);
  const [selectedUserForReactivate, setSelectedUserForReactivate] =
    useState<UserData | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search),
  );

  const handleActionClick = (user: UserData) => {
    if (user.status === "Active") {
      setSelectedUserForSuspend(user);
    } else {
      setSelectedUserForReactivate(user);
    }
  };

  const handleConfirmSuspend = (userId: number, reason: string) => {
    console.log(`Suspending user ${userId} for: ${reason}`);
    setUsers(
      users.map((u) => (u.no === userId ? { ...u, status: "Suspended" } : u)),
    );
    setSelectedUserForSuspend(null);
  };

  const handleConfirmReactivate = (userId: number) => {
    console.log(`Reactivating user ${userId}`);
    setUsers(
      users.map((u) => (u.no === userId ? { ...u, status: "Active" } : u)),
    );
    setSelectedUserForReactivate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end mb-6 gap-2 w-full box-border">
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for users..."
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-[580px] bg-white">
        <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <thead>
            <tr className="bg-secondary text-white h-[52px]">
              <th className="px-5 py-3 text-desc-semibold tracking-wider text-center w-[5%]">
                No.
              </th>
              <th className="px-5 py-3 text-desc-semibold tracking-wider w-[18%]">
                Username
              </th>
              <th className="px-5 py-3 text-desc-semibold tracking-wider w-[20%]">
                Email
              </th>
              <th className="px-6 py-3 text-desc-semibold tracking-wider w-[13%]">
                Phone
              </th>
              <th className="px-6 py-3 text-desc-semibold tracking-wider w-[10%]">
                Gender
              </th>
              <th className="px-5 py-3 text-desc-semibold tracking-wider text-center w-[10%]">
                <div className="flex items-center justify-center gap-1 cursor-pointer select-none">
                  Gen <ArrowUp size={16} />
                  <ListFilter size={16} />
                </div>
              </th>
              <th className="px-8 py-3 text-desc-semibold tracking-wider w-[12%]">
                <div className="flex items-center gap-1 cursor-pointer select-none">
                  Status <ListFilter size={16} />
                </div>
              </th>
              <th className="px-6 py-3 text-desc-semibold tracking-wider w-[10%]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRow
                  key={user.no}
                  user={user}
                  onEditRole={(u) => setSelectedUserForRole(u)}
                  onToggleSuspend={handleActionClick}
                />
              ))
            ) : (
              <tr className="h-[520px]">
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-slate-400 border border-slate-100">
                      <UserX size={30} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-secondary">
                        User doesn't exist
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        We couldn't find any match for your current query.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 && <Pagination />}

      {selectedUserForRole && (
        <EditRoleModal
          user={selectedUserForRole}
          onClose={() => setSelectedUserForRole(null)}
          onSave={(id, role) => setSelectedUserForRole(null)}
        />
      )}

      {selectedUserForSuspend && (
        <SuspendModal
          user={selectedUserForSuspend}
          onClose={() => setSelectedUserForSuspend(null)}
          onConfirm={handleConfirmSuspend}
        />
      )}

      {selectedUserForReactivate && (
        <ReactivateModal
          user={selectedUserForReactivate}
          onClose={() => setSelectedUserForReactivate(null)}
          onConfirm={handleConfirmReactivate}
        />
      )}
    </div>
  );
}
