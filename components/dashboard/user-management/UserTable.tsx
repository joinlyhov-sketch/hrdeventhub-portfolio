"use client";

import React, { useState, useMemo, useTransition } from "react";
import { UserX, ListFilter, ArrowUp, ArrowDown } from "lucide-react";
import Search from "../../site/search/Search";
import UserRow from "./UserRow";
import EditRoleModal from "../pop-up/user-management-pop-up/EditRoleModal";
import SuspendModal from "../pop-up/user-management-pop-up/SuspendModal";
import ReactivateModal from "../pop-up/user-management-pop-up/ReactivateModal";
import FilterStatusModal from "../pop-up/user-management-pop-up/FilterStatusModal";
import { UserData } from "../../../types/user-management-type/user";
import { PaginationDemo } from "@/components/feedback/Pagination";
import { toast } from "sonner";
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
  const [genSortAsc, setGenSortAsc] = useState<boolean>(true);
  const [sortApplied, setSortApplied] = useState<boolean>(false);
  const itemsPerPage = 10;

  const [isPending, startTransition] = useTransition();

  const [selectedUserForRole, setSelectedUserForRole] =
    useState<UserData | null>(null);
  const [selectedUserForSuspend, setSelectedUserForSuspend] =
    useState<UserData | null>(null);
  const [selectedUserForReactivate, setSelectedUserForReactivate] =
    useState<UserData | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  const currentLoggedInUserNo = useMemo(() => {
    return "";
  }, []);

  const uniqueGenerations = useMemo(() => {
    const generations = users
      .map((user) => user.generation?.name)
      .filter(Boolean);
    return Array.from(new Set(generations)).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesGen =
        selectedGen === "all" || user.generation?.name === selectedGen;

      // Filter mapping logic supporting 'all' state checks
      const matchesStatus =
        selectedStatus === "all" ||
        selectedStatus === "" ||
        user.status?.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesGen && matchesStatus;
    });

    if (!sortApplied) return filtered;

    return [...filtered].sort((a, b) => {
      const genA = parseInt(a.generation?.name?.replace(/\D/g, "") || "0", 10);
      const genB = parseInt(b.generation?.name?.replace(/\D/g, "") || "0", 10);
      return genSortAsc ? genA - genB : genB - genA;
    });
  }, [users, search, selectedGen, selectedStatus, genSortAsc, sortApplied]);

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
          toast.success("User reactivated successfully");
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
            prev.map((u) =>
              u.no === idString ? { ...u, status: "Suspended" } : u,
            ),
          );
          toast.success("User has been suspended successfully");
          setSelectedUserForSuspend(null);
        } else {
          toast.error(
            response?.message || "Server rejected suspension request.",
          );
        }
      } catch (err) {
        console.error("Suspension system failure:", err);
        toast.error("An error occurred during suspension execution.");
      }
    });
  };

  const handleConfirmRoleChange = (
    userId: string | number,
    role: "ADMIN" | "ORGANIZER" | "ALUMNI" | "STUDENT",
  ) => {
    const idString = userId.toString();
    startTransition(async () => {
      try {
        const response = await updateUserRoleAction(idString, role);
        if (response?.success) {
          setUsers((prev) =>
            prev.map((u) => (u.no === idString ? { ...u, role: role } : u)),
          );
          setSelectedUserForRole(null);
          toast.success("Role updated successfully");
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleEditClick = (user: UserData) => {
    const latestUser = users.find((u) => u.no === user.no);
    setSelectedUserForRole(latestUser || user);
  };

  const extractGenNumber = (genName: string | undefined | null) => {
    if (!genName) return "N/A";
    const match = genName.match(/\d+/);
    return match ? match[0] : genName;
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
              <TableHead className="px-1 py-3 text-white text-center w-[10%] type-desc-semibold">
                No.
              </TableHead>
              <TableHead className="px-6 py-3 text-white w-[30%] type-desc-semibold">
                Username
              </TableHead>
              <TableHead className="px-1 py-3 text-white w-[37%] type-desc-semibold">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-white w-[25%] type-desc-semibold">
                Phone
              </TableHead>
              <TableHead className="px-6 py-3 text-white w-[15%] type-desc-semibold">
                Gender
              </TableHead>
              <TableHead className="px-1 py-3 text-center text-white type-desc-semibold w-[15%]">
                <div className="flex items-center justify-center gap-1">
                  <span className="select-none whitespace-nowrap">
                    Gen{" "}
                    {selectedGen !== "all"
                      ? `(${selectedGen.replace(/\D/g, "")})`
                      : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSortApplied(true);
                      setGenSortAsc((prev) => !prev);
                      setCurrentPage(1);
                    }}
                    className="hover:text-blue-200 cursor-pointer transition-colors shrink-0"
                  >
                    {!sortApplied || genSortAsc ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="hover:text-blue-200 cursor-pointer transition-colors shrink-0"
                      >
                        <ListFilter size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[100px]"
                    >
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
                            {extractGenNumber(gen.toString())}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>

              <TableHead className="px-1 py-3 text-center text-white type-desc-semibold w-[15%]">
                <div
                  onClick={() => setIsStatusModalOpen(true)}
                  className="flex items-center justify-center gap-1 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200"
                >
                  <span className="truncate">
                    Status{" "}
                    {selectedStatus !== "all" && selectedStatus !== ""
                      ? `(${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)})`
                      : ""}
                  </span>
                  <ListFilter size={16} className="shrink-0" />
                </div>
              </TableHead>

              <TableHead className="px-1 py-3 text-white w-[20%] type-desc-semibold">
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
                    onEditRole={handleEditClick}
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

      {isStatusModalOpen && (
        <FilterStatusModal
          initialStatus={selectedStatus === "all" ? "" : selectedStatus}
          onClose={() => setIsStatusModalOpen(false)}
          onClear={() => {
            setSelectedStatus("all");
            setCurrentPage(1);
            setIsStatusModalOpen(false);
            toast.info("Status filter cleared");
          }}
          onFilterChange={(newStatus) => {
            setSelectedStatus(newStatus || "all");
            setCurrentPage(1);
          }}
        />
      )}

      {selectedUserForRole && (
        <EditRoleModal
          user={selectedUserForRole}
          onClose={() => setSelectedUserForRole(null)}
          onSave={handleConfirmRoleChange}
        />
      )}

      {selectedUserForSuspend && (
        <SuspendModal
          user={selectedUserForSuspend}
          onClose={() => setSelectedUserForSuspend(null)}
          onConfirm={handleConfirmSuspend}
          isCurrentUser={
            currentLoggedInUserNo !== "" &&
            String(selectedUserForSuspend.no) === String(currentLoggedInUserNo)
          }
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
