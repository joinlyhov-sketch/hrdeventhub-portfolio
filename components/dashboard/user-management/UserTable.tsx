"use client";

import React, { useState, useMemo } from "react";
import { UserX, ListFilter, ArrowUp } from "lucide-react";
import Search from "../../site/search/Search";
import UserRow from "./UserRow";
import Pagination from "./Pagination";
import EditRoleModal from "../pop-up/user-management-pop-up/EditRoleModal";
import SuspendModal from "../pop-up/user-management-pop-up/SuspendModal";
import ReactivateModal from "../pop-up/user-management-pop-up/ReactivateModal";
import { UserData } from "../../../data/UserData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";

interface UserTableClientProps {
  initialUsers: UserData[];
}

export default function UserTableClient({
  initialUsers,
}: UserTableClientProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedGen, setSelectedGen] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [selectedUserForRole, setSelectedUserForRole] =
    useState<UserData | null>(null);
  const [selectedUserForSuspend, setSelectedUserForSuspend] =
    useState<UserData | null>(null);
  const [selectedUserForReactivate, setSelectedUserForReactivate] =
    useState<UserData | null>(null);

  const uniqueGenerations = useMemo(() => {
    const generations = initialUsers.map((user) => user.gen);
    return Array.from(new Set(generations)).sort((a, b) => a - b);
  }, [initialUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search);

    const matchesGen =
      selectedGen === "all" || user.gen.toString() === selectedGen;

    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesGen && matchesStatus;
  });

  const handleActionClick = (user: UserData) => {
    if (user.status === "Active") {
      setSelectedUserForSuspend(user);
    } else {
      setSelectedUserForReactivate(user);
    }
  };

  const handleConfirmSuspend = (userId: number, reason: string) => {
    setUsers(
      users.map((u) => (u.no === userId ? { ...u, status: "Suspended" } : u)),
    );
    setSelectedUserForSuspend(null);
  };

  const handleConfirmReactivate = (userId: number) => {
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
        <Table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b-0 h-[52px]">
              <TableHead className="px-5 py-3 cursor-pointer text-desc-semibold tracking-wider text-center text-white w-[5%]">
                No.
              </TableHead>
              <TableHead className="px-6 py-3 cursor-pointer text-desc-semibold tracking-wider text-white w-[18%]">
                Username
              </TableHead>
              <TableHead className="px-5 py-3 cursor-pointer text-desc-semibold tracking-wider text-white w-[20%]">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 cursor-pointer text-desc-semibold tracking-wider text-white w-[13%]">
                Phone
              </TableHead>
              <TableHead className="px-6 py-3 cursor-pointer text-desc-semibold tracking-wider text-white w-[10%]">
                Gender
              </TableHead>

              <TableHead className="px-1 py-3 cursor-pointer text-desc-semibold tracking-wider text-center text-white w-[10%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center gap-1 select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        Gen {selectedGen !== "all" ? `(${selectedGen})` : ""}
                      </span>
                      <ArrowUp size={16} className="shrink-0" />
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-0 min-w-[135px]">
                    <DropdownMenuRadioGroup
                      value={selectedGen}
                      onValueChange={setSelectedGen}
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        All
                      </DropdownMenuRadioItem>
                      {uniqueGenerations.map((gen) => (
                        <DropdownMenuRadioItem
                          key={gen}
                          value={gen.toString()}
                          className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                        >
                          Generation {gen}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>

              <TableHead className="px-1 py-3 text-desc-semibold tracking-wider text-center text-white w-[15%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        Status {selectedStatus !== "all" ? `(${selectedStatus})` : ""}
                      </span>
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[125px]">
                    <DropdownMenuRadioGroup
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        All
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Active"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Active
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Suspended"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Suspended
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>

              <TableHead className="px-1 py-3 text-desc-semibold tracking-wider text-white w-[10%]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
              <TableRow className="h-[520px] hover:bg-transparent border-b-0">
                <TableCell colSpan={8} className="px-6 py-16 text-center">
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
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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