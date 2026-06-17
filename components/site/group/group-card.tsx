"use client";

import { useCurrentUser } from "@/context/user-context";
import Link from "next/link";
import Image from "next/image";
import { Globe, LockKeyhole } from "lucide-react";
import GroupDropDown from "../pop-up/action-button/action-button-group";
import { Workspace } from "@/types/workspace-type/group";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import { getMediaUrl } from "@/libs/media";

interface GroupCardProps {
  workspace: Workspace;
  pinnedCount: number;
}

export default function GroupCard({ workspace, pinnedCount }: GroupCardProps) {
  const { currentUser } = useCurrentUser();
  const isInternal = !workspace.isPublic;
  const { members } = useWorkspaceMembers(workspace.workspaceId);

  const visibleMembers = members.slice(0, 3);
  const extraCount = members.length - visibleMembers.length;
  

  return (
    <div className="w-full bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border flex flex-col hover:shadow-sm transition-all relative group overflow-hidden">
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isInternal
            ? "bg-[linear-gradient(225deg,#F6F0EC_25%,#FDFDFD_42%)]"
            : "bg-[linear-gradient(225deg,#DDE6FF_10%,#FDFDFD_42%)]"
        } opacity-90`}
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <span className="flex items-center justify-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-primary/10 type-detail-small-medium text-primary text-xs md:text-sm">
            {isInternal ? <LockKeyhole size={12} /> : <Globe size={12} />}
            {isInternal ? "Internal" : "External"}
          </span>
          <div className="flex items-center gap-2">
            <GroupDropDown
              workspace={workspace}
              userRole={currentUser?.role}
              pinnedCount={pinnedCount}
            />
          </div>
        </div>

        <h2 className="text-base md:text-subtitle font-black bg-linear-to-r from-primary to-[#efa537] bg-clip-text text-transparent mb-2 md:mb-3 uppercase tracking-wide line-clamp-1">
          {workspace.name}
        </h2>

        <p className="text-secondary type-detail-medium leading-relaxed mb-6 md:mb-10 w-full md:w-[70%] text-xs md:text-sm line-clamp-2">
          {workspace.description}
        </p>

        <div className="mt-auto pt-4 md:pt-6 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center -space-x-2 md:-space-x-3 select-none">
            {visibleMembers.map((member) => {
              const firstLetter = member.firstName?.[0] ?? "";
              const lastLetter = member.lastName?.[0] ?? "";
              const mediaUrl = getMediaUrl(member.profileImage);

              return (
                <div
                  key={member.appUserId}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-primary/10 overflow-hidden shadow-sm flex items-center justify-center shrink-0"
                  title={`${member.firstName} ${member.lastName}`}
                >
                  {mediaUrl ? (
                    <Image
                      src={mediaUrl}
                      alt={`${member.firstName} ${member.lastName}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-[10px] md:text-[11px] font-bold text-primary uppercase">
                      {firstLetter}{lastLetter}
                    </span>
                  )}
                </div>
              );
            })}

            {extraCount > 0 && (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-[#EBF5FB] flex items-center justify-center text-[#3FA6DC] type-desc-small-semibold shadow-sm shrink-0 text-xs">
                +{extraCount}
              </div>
            )}

            {members.length === 0 && (
              <span className="text-xs text-gray-400 font-medium">
                No members yet
              </span>
            )}
          </div>

          <Link href={`/group/${workspace.workspaceId}`} className="shrink-0">
            <button className="bg-primary text-primary-foreground px-4 md:px-7 py-2 md:py-3 rounded-xl type-detail-semibold hover:bg-action hover:text-action-foreground transition-all shadow-sm cursor-pointer text-xs md:text-sm whitespace-nowrap">
              View Group
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}