"use client";

import React, { useState, useMemo, useTransition } from "react";
import { UserX, ListFilter, ArrowUp, UserRoundCheck } from "lucide-react";
import Search from "../../site/search/Search";
import UserRow from "./UserRow";
import EditRoleModal from "../pop-up/user-management-pop-up/EditRoleModal";
import SuspendModal from "../pop-up/user-management-pop-up/SuspendModal";
import ReactivateModal from "../pop-up/user-management-pop-up/ReactivateModal";
import { UserData } from "../../../types/user-management-type/user";
import { PaginationDemo } from "@/components/feedback/Pagination";
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

import {
  suspendUserAction,
  reactivateUserAction,
  updateUserRoleAction,
} from "../../../actions/user.action";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [isPending, startTransition] = useTransition();

  const [selectedUserForRole, setSelectedUserForRole] =
    useState<UserData | null>(null);
  const [selectedUserForSuspend, setSelectedUserForSuspend] =
    useState<UserData | null>(null);
  const [selectedUserForReactivate, setSelectedUserForReactivate] =
    useState<UserData | null>(null);

  const uniqueGenerations = useMemo(() => {
    const generations = users.map((user) => user.gen).filter(Boolean);
    return Array.from(new Set(generations)).sort(
      (a, b) => Number(a) - Number(b),
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.phone && user.phone.includes(search));

      const matchesGen =
        selectedGen === "all" || user.gen.toString() === selectedGen;

      const matchesStatus =
        selectedStatus === "all" ||
        user.status?.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesGen && matchesStatus;
    });
  }, [users, search, selectedGen, selectedStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleActionClick = (user: UserData) => {
    if (user.status.toLowerCase() === "active") {
      setSelectedUserForSuspend(user);
    } else {
      setSelectedUserForReactivate(user);
    }
  };

  const handleConfirmReactivate = (userId: string | number) => {
    const idString = userId.toString();
    startTransition(async () => {
      try {
        const response = await reactivateUserAction(idString);
        if (response.success) {
          setUsers((prev) =>
            prev.map((u) =>
              u.no === idString ? { ...u, status: "Active" } : u,
            ),
          );
        }
        setSelectedUserForReactivate(null);
      } catch (err) {
        console.error("Failed to reactivate user:", err);
      }
    });
  };

  const handleConfirmSuspend = (userId: string | number, reason: string) => {
  const idString = userId.toString();

  startTransition(async () => {
    try {
      const response = await suspendUserAction(idString, reason);

      if (response && response.success) {
        setUsers((prev) =>
          prev.map((u) => (u.no === idString ? { ...u, status: "Suspended" } : u))
        );
        setSelectedUserForSuspend(null);
      } else {
        console.error("Backend validation rejected suspension request:", response?.message);
        alert(response?.message || "Server rejected suspension execution request.");
      }
    } catch (err) {
      console.error("Network crash executing suspension pipeline action:", err);
    }
  });
};

  const handleConfirmRoleChange = (userId: string | number, role: string) => {
    if (
      role !== "ADMIN" &&
      role !== "ORGANIZER" &&
      role !== "ALUMNI" &&
      role !== "STUDENT"
    )
      return;
    const idString = userId.toString();

    startTransition(async () => {
      try {
        const response = await updateUserRoleAction(idString, role);
        if (response.success) {
          setUsers((prev) =>
            prev.map((u) => (u.no === idString ? { ...u, role: role } : u)),
          );
        }
        setSelectedUserForRole(null);
      } catch (err) {
        console.error("Failed to update user role:", err);
      }
    });
  };

  return (
    <div
      className={`space-y-6 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-end mb-6 gap-2 w-full box-border">
        <Search
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search for users..."
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-[580px] bg-white">
        <Table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b-0 h-[52px]">
              <TableHead className="px-1 py-3 text-white text-center w-[5%] font-semibold">
                No.
              </TableHead>
              <TableHead className="px-6 py-3 text-white w-[20%] font-semibold">
                Username
              </TableHead>
              <TableHead className="px-2 py-3 text-white w-[25%] font-semibold">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-white w-[20%] font-semibold">
                Phone
              </TableHead>
              <TableHead className="px-6 py-3 text-white w-[8%] font-semibold">
                Gender
              </TableHead>

              <TableHead className="px-1 py-3 text-center text-white w-[14%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        Gen {selectedGen !== "all" ? `(${selectedGen})` : ""}
                      </span>
                      <ArrowUp size={16} className="shrink-0" />
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-0 min-w-[1px]">
                    <DropdownMenuRadioGroup
                      value={selectedGen}
                      onValueChange={(v) => {
                        setSelectedGen(v);
                        setCurrentPage(1);
                      }}
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

              <TableHead className="px-1 py-3 text-center text-white w-[14%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        Status{" "}
                        {selectedStatus !== "all" ? `(${selectedStatus})` : ""}
                      </span>
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[125px]">
                    <DropdownMenuRadioGroup
                      value={selectedStatus}
                      onValueChange={(v) => {
                        setSelectedStatus(v);
                        setCurrentPage(1);
                      }}
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
              <TableHead className="px-1 py-3 text-white w-[12%] font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, idx) => {
                const pageOffset =
                  (Number(currentPage) - 1) * Number(itemsPerPage);
                const sequentialRowNumber = isNaN(pageOffset)
                  ? idx
                  : pageOffset + idx;

                return (
                  <UserRow
                    key={user.no}
                    user={user}
                    index={sequentialRowNumber}
                    onEditRole={(u) => setSelectedUserForRole(u)}
                    onToggleSuspend={handleActionClick}
                  />
                );
              })
            ) : (
              <TableRow className="h-[520px] hover:bg-transparent border-b-0">
                <TableCell colSpan={8} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center border border-slate-100">
                      <UserX size={30} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-secondary">
                        User doesn&apos;t exist
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        We couldn&apos;t find any match for your current query.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length > 0 && (
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedUserForRole && (
        <EditRoleModal
          user={selectedUserForRole}
          onClose={() => setSelectedUserForRole(null)}
          onSave={(id, role) => handleConfirmRoleChange(id, role)}
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
