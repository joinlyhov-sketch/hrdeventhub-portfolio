"use client";

import { useSearchParams } from "next/navigation";
import { UserX } from "lucide-react";

import { useWorkspaces } from "@/hooks/use-workspaces";
import GroupCard from "./group-card";

export default function GroupList() {
  const searchParams = useSearchParams();

  const search =
    searchParams.get("search") ?? "";

  const {
    workspaces,
    isLoading,
  } = useWorkspaces({
    page: 1,
    size: 10,
    name: search,
  });

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!workspaces.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-2xl border border-gray-100 p-6 min-h-110">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
          <UserX size={22} />
        </div>

        <div>
          <p className="text-base font-bold text-slate-700">
            Data doesn&apos;t exist
          </p>

          <p className="text-sm text-slate-400 font-medium">
            We couldn&apos;t find any match for your current query.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {workspaces.map((workspace) => (
        <GroupCard
          key={workspace.workspaceId}
          group={{
            id: Number(
              workspace.workspaceId.replace(/\D/g, "").slice(0, 10)
            ),

            title: workspace.name,

            description:
              workspace.description,

            type: workspace.isPublic
              ? "External"
              : "Internal",

            memberCount: 0,
          }}
        />
      ))}
    </div>
  );
}