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

  const pinnedCount = isAdmin ? 0 : workspaces.filter((w) => w.isPinned).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {Array.from({ length: 9 }).map((_, index) => (
          <GroupCardSkeleton key={index} />
        ))}
      </div>
    );
  }

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
          <GroupCard
            key={workspace.workspaceId}
            workspace={workspace}
            pinnedCount={pinnedCount}
          />
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

function GroupCardSkeleton() {
  return (
    <div className="w-full bg-card p-6 rounded-3xl border border-border flex flex-col relative overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-linear-to-b from-slate-50/50 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-24 bg-slate-200 rounded-full" />
          <div className="w-9 h-9 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-3" />
        <div className="space-y-2 mb-10 w-[70%]">
          <div className="h-4 bg-slate-200 rounded-md w-full" />
          <div className="h-4 bg-slate-100 rounded-md w-5/6" />
        </div>
        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm" />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm" />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 shadow-sm" />
          </div>
          <div className="h-[46px] w-[124px] bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}