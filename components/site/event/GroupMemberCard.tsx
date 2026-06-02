"use client";

import { useState } from "react";
import Search from "@/components/site/search/Search";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";

interface GroupMemberCardProps {
  groupid: string;
}

export default function GroupMemberCard({ groupid }: GroupMemberCardProps) {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { members, isLoading } = useWorkspaceMembers(groupid);

  const filteredMembers = members.filter((member) => {
    const first = member.firstName ?? "";
    const last = member.lastName ?? "";
    const fullName = `${first} ${last}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const displayedMembers = showAll ? filteredMembers : members.slice(0, 3);

  const headerVisibleMembers = members.slice(0, 2);
  const headerExtraCount = members.length - headerVisibleMembers.length;

  if (isLoading && members.length === 0) {
    return (
      <div className="w-full max-w-md bg-background rounded-[12px] border border-border p-5 shadow-sm animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-2" />
        <div className="h-4 bg-muted rounded w-1/4 mb-6" />
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded-full w-full" />
          <div className="h-10 bg-muted rounded-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-background rounded-[12px] border border-border p-5 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h3 className="type-subtitle font-extrabold text-primary leading-tight truncate">
            Group Member
          </h3>
          <p className="type-detail-small-medium text-grey-400">
            {members.length} {members.length === 1 ? "Member" : "Members"}
          </p>
        </div>
        <div className="flex items-center -space-x-2 shrink-0 select-none">
          {headerVisibleMembers.map((member) => {
            const firstLetter = member.firstName?.[0] ?? "";
            const lastLetter = member.lastName?.[0] ?? "";
            return (
              <div
                key={member.appUserId}
                className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 overflow-hidden shadow-sm flex items-center justify-center shrink-0"
                title={`${member.firstName} ${member.lastName}`}
              >
                <span className="text-[10px] font-bold text-primary uppercase">
                  {firstLetter}{lastLetter}
                </span>
              </div>
            );
          })}
          {headerExtraCount > 0 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary type-detail-small-medium text-white flex items-center justify-center font-bold text-xs shrink-0">
              +{headerExtraCount}
            </div>
          )}
        </div>
      </div>

      {showAll && (
        <div className="mb-5 animate-in fade-in duration-200">
          <Search
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for members..."
          />
        </div>
      )}

      <div
        className={`space-y-4 mb-3 pr-2 pl-2 ${
          showAll ? "max-h-80 overflow-y-auto pr-1" : ""
        }`}
      >
        {displayedMembers.length > 0 ? (
          displayedMembers.map((member) => {
            const firstLetter = member.firstName?.[0] ?? "";
            const lastLetter = member.lastName?.[0] ?? "";
            return (
              <div key={member.appUserId} className="flex items-center gap-3 min-w-0 w-full">
                <div
                  className="w-10 h-10 rounded-full border border-border bg-primary/10 overflow-hidden shadow-sm flex items-center justify-center shrink-0"
                  title={`${member.firstName} ${member.lastName}`}
                >
                  <span className="text-[11px] font-bold text-primary uppercase">
                    {firstLetter}{lastLetter}
                  </span>
                </div>
                <span className="type-detail-semibold text-primary grow min-w-0 truncate">
                  {member.firstName} {member.lastName}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            {members.length === 0 
              ? "No members yet" 
              : `No members found matching “${searchQuery}”`
            }
          </p>
        )}
      </div>

      {members.length > 0 && (
        <button
          onClick={() => {
            setShowAll(!showAll);
            if (showAll) setSearchQuery("");
          }}
          className="w-full bg-primary text-white py-3 rounded-2xl type-detail-semibold hover:bg-primary-hover transition-all cursor-pointer text-center font-medium"
        >
          {showAll ? "View Less Members" : "View All Members"}
        </button>
      )}
    </div>
  );
}