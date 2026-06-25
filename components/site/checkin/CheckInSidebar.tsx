"use client";

import { useState, useMemo } from "react";
import { Attendee } from "@/service/checkin.service";
import { Button } from "../../ui/button";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";

const PHNOM_PENH_LOCALE = "en-US";
const PHNOM_PENH_TZ = "Asia/Phnom_Penh";

interface CheckInSidebarProps {
  attendees: Attendee[];
  selectedPostId?: string;
  onSelectPost: (postId?: string) => void;
}

interface PostSummary {
  postId: string;
  postTitle: string;
  workspaceName: string;
  eventStart: string | null;
  eventEnd: string | null;
  totalCount: number;
  checkedInCount: number;
}

const formatSidebarDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(PHNOM_PENH_LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: PHNOM_PENH_TZ,
  });
};

const formatSidebarTime = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString(PHNOM_PENH_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: PHNOM_PENH_TZ,
  });
};

export function CheckInSidebar({
  attendees,
  selectedPostId,
  onSelectPost,
}: CheckInSidebarProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);

  const workspaces = useMemo(() => {
    const names = [...new Set(attendees.map((a) => a.workspaceName))];
    return names.sort();
  }, [attendees]);

  const postSummaries = useMemo(() => {
    const map = new Map<string, PostSummary>();
    attendees.forEach((a) => {
      if (!map.has(a.postId)) {
        map.set(a.postId, {
          postId: a.postId,
          postTitle: a.postTitle,
          workspaceName: a.workspaceName,
          eventStart: a.eventStart,
          eventEnd: a.eventEnd,
          totalCount: 0,
          checkedInCount: 0,
        });
      }
      const entry = map.get(a.postId)!;
      entry.totalCount += 1;
      if (a.ticketStatus === "CHECKED_IN") {
        entry.checkedInCount += 1;
      }
    });
    return [...map.values()];
  }, [attendees]);

  const filteredPosts = useMemo(() => {
    const byWorkspace =
      selectedWorkspace === "all"
        ? postSummaries
        : postSummaries.filter((p) => p.workspaceName === selectedWorkspace);
    return showAll ? byWorkspace : byWorkspace.slice(0, 4);
  }, [postSummaries, selectedWorkspace, showAll]);

  const totalForWorkspace = useMemo(() => {
    if (selectedWorkspace === "all") return attendees.length;
    return attendees.filter((a) => a.workspaceName === selectedWorkspace)
      .length;
  }, [attendees, selectedWorkspace]);

  const selectedWorkspaceLabel =
    selectedWorkspace === "all" ? "All Workspaces" : selectedWorkspace;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="type-subtitle-24 font-semibold text-secondary">
          All Events
        </h3>
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center justify-between px-3 py-2 mb-5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 text-sm text-gray-700 font-medium cursor-pointer">
            <span className="truncate">{selectedWorkspaceLabel}</span>
            {isOpen ? (
              <ChevronUp size={15} className="shrink-0 ml-2 text-gray-400" />
            ) : (
              <ChevronDown size={15} className="shrink-0 ml-2 text-gray-400" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="rounded-xl border border-slate-100 shadow-xl bg-white p-1"
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        >
          <DropdownMenuRadioGroup
            value={selectedWorkspace}
            onValueChange={(val) => {
              setSelectedWorkspace(val);
              onSelectPost(undefined);
              setShowAll(false);
            }}
          >
            <DropdownMenuRadioItem
              value="all"
              className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
            >
              All Workspaces
            </DropdownMenuRadioItem>
            {workspaces.map((ws) => (
              <DropdownMenuRadioItem
                key={ws}
                value={ws}
                className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
              >
                {ws}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2 mb-4 px-1">
        <Users size={14} className="text-gray-400" />
        <p className="text-xs text-gray-400">
          Total Attendees:{" "}
          <span className="font-semibold text-secondary">
            {totalForWorkspace}
          </span>
        </p>
      </div>

      <div
        className={`space-y-3 overflow-x-hidden ${showAll ? "max-h-[500px] overflow-y-auto" : "overflow-hidden"}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.postId}
              onClick={() =>
                onSelectPost(
                  selectedPostId === post.postId ? undefined : post.postId,
                )
              }
              className={`border-l-4 rounded-lg cursor-pointer transition-all px-3 py-3 border-l-teal-500 ${
                selectedPostId === post.postId
                  ? "bg-blue-50 scale-95 ease-in-out duration-300"
                  : "hover:bg-gray-50 bg-gray-50/50"
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <p className="text-[11px] text-gray-400 font-medium truncate max-w-[120px]">
                  {post.workspaceName}
                </p>
                <span className="text-[11px] text-gray-400 shrink-0">
                  {post.totalCount} total
                </span>
              </div>
              <h4
                className={`text-sm font-semibold mb-1.5 leading-tight ${
                  selectedPostId === post.postId
                    ? "text-action"
                    : "text-gray-800"
                }`}
              >
                {post.postTitle}
              </h4>
              <p className="text-[11px] text-gray-400 mb-2">
                {formatSidebarDate(post.eventStart)}
                {" • "}
                {formatSidebarTime(post.eventStart)}
                {" – "}
                {formatSidebarTime(post.eventEnd)}
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F9F1] text-accent">
                  ● {post.checkedInCount} In
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700">
                  ● {post.totalCount - post.checkedInCount} Pending
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No events found
          </p>
        )}
      </div>

      <Button
        onClick={() => setShowAll(!showAll)}
        className="w-full mt-5 border border-primary text-primary bg-background hover:bg-blue-50 rounded-lg cursor-pointer"
      >
        {showAll ? "Show Less" : "View All Events"}
      </Button>
    </div>
  );
}
