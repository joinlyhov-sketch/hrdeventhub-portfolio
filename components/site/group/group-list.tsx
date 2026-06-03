"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { UserX } from "lucide-react";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useMyWorkspaces } from "@/hooks/use-my-workspace";
import { useCurrentUser } from "@/context/user-context";
import GroupCard from "./group-card";
import { PaginationDemo } from "@/components/feedback/Pagination";

export default function GroupList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type") ?? "";
  const [page, setPage] = useState(1);
  const { currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    setPage(1);
  }, [search, type]);

  const adminData = useWorkspaces({ page, size: 9, name: search });
  const memberData = useMyWorkspaces();

  const { workspaces, totalPages, isLoading } = isAdmin
    ? { ...adminData, totalPages: adminData.totalPages }
    : { workspaces: memberData.workspaces, totalPages: 1, isLoading: memberData.isLoading };

  const filtered = workspaces.filter((workspace) => {
    const matchType =
      type === "Internal" ? !workspace.isPublic :
      type === "External" ? workspace.isPublic :
      true;
    const matchSearch = isAdmin
      ? true
      : search.trim() ? workspace.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchType && matchSearch;
  });

  if (isLoading) return <div>Loading...</div>;

  if (!filtered.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-gray-100 p-6 min-h-110">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
          <UserX size={22} />
        </div>
        <div>
          <p className="text-base font-bold text-slate-700">Data doesn&apos;t exist</p>
          <p className="text-sm text-slate-400 font-medium">
            We couldn&apos;t find any match for your current query.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {filtered.map((workspace) => (
          <GroupCard key={workspace.workspaceId} workspace={workspace} />
        ))}
      </div>
      {isAdmin && totalPages > 1 && (
        <PaginationDemo
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}