"use client";
import React, { useState, useTransition } from "react";
import { SquarePen, Trash2, Link2, MoreHorizontal, Pin, PinOff, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down/dropdown-menu";
import EditGroupModal from "@/components/site/pop-up/action-button/EditGroupForm";
import { GroupDeleteModal } from "@/components/site/pop-up/commons/delete-modal-group";
import CreateInvitationLinkModal from "@/components/site/pop-up/action-button/CreateInvitationLinkModal";
import LeaveWorkspaceModal from "@/components/site/pop-up/action-button/LeaveGroupPopUp";
import { Workspace } from "@/types/workspace-type/group";
import { useSession } from "next-auth/react";
import { workspaceService } from "@/service/workspace.service";
import { mutate } from "swr";

const MAX_PINNED = 3;

interface GroupDropDownProps {
  workspace: Workspace;
  userRole?: string;
  pinnedCount: number;
}

export default function GroupDropDown({ workspace, userRole, pinnedCount }: GroupDropDownProps) {
  const { data: session } = useSession();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLeavePending, setIsLeavePending] = useState(false); 

  const isAdmin = userRole === "admin";
  const isAlreadyPinned = workspace.isPinned;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const groupLink = `${window.location.origin}/group/${workspace.workspaceId}`;
    navigator.clipboard.writeText(groupLink);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.accessToken) return;
    if (!isAlreadyPinned && pinnedCount >= MAX_PINNED) return;

    startTransition(async () => {
      try {
        await workspaceService.togglePin(workspace.workspaceId, !workspace.isPinned, session.accessToken);
        await mutate(
          (key: unknown) => Array.isArray(key) && (key[0] === "workspaces-me" || key[0] === "workspaces"),
          undefined,
          { revalidate: true }
        );
      } catch (error) {
        console.error("[togglePin] Failed:", error);
      }
    });
  };

  const handleLeaveConfirm = async () => {
    if (!session?.accessToken) return;
    setIsLeavePending(true);
    try {
      await workspaceService.leave(workspace.workspaceId, session.accessToken);
      await mutate(
        (key: unknown) => Array.isArray(key) && (key[0] === "workspaces-me" || key[0] === "workspaces"),
        undefined,
        { revalidate: true }
      );
      setIsLeaveOpen(false);
    } catch (error) {
      console.error("[leaveWorkspace] Failed:", error);
    } finally {
      setIsLeavePending(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-primary cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none p-1.5 rounded-lg hover:bg-muted/50 transition-colors inline-flex items-center justify-center"
          >
            <MoreHorizontal size={24} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 bg-card p-1.5 border border-border rounded-xl shadow-md flex flex-col gap-1" align="end">
          <DropdownMenuGroup className="flex flex-col gap-1">
            {isAdmin && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary cursor-pointer transition-colors"
              >
                <SquarePen size={16} className="stroke-primary" />
                Edit
              </DropdownMenuItem>
            )}

            {!isAdmin && (
              <DropdownMenuItem
                onClick={handleTogglePin}
                disabled={isPending || (!isAlreadyPinned && pinnedCount >= MAX_PINNED)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-action hover:bg-action/10 focus:bg-action/10 hover:text-action focus:text-action cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAlreadyPinned ? (
                  <><PinOff size={16} className="stroke-action" /> Unpin</>
                ) : (
                  <><Pin size={16} className="stroke-action" /> {pinnedCount >= MAX_PINNED ? "Pin limit reached" : "Pin to Sidebar"}</>
                )}
              </DropdownMenuItem>
            )}

            {isAdmin ? (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); setIsLinkOpen(true); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-action hover:bg-action/10 focus:bg-action/10 hover:text-action focus:text-action cursor-pointer transition-colors"
              >
                <Link2 size={16} className="stroke-action" />
                Link
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleCopyLink}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-action hover:bg-action/10 focus:bg-action/10 hover:text-action focus:text-action cursor-pointer transition-colors"
              >
                <Link2 size={16} className="stroke-action" />
                Copy Link
              </DropdownMenuItem>
            )}

            {isAdmin && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); setIsDeleteOpen(true); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive cursor-pointer transition-colors"
              >
                <Trash2 size={16} className="stroke-destructive" />
                Delete
              </DropdownMenuItem>
            )}

            {!isAdmin && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); setIsLeaveOpen(true); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive cursor-pointer transition-colors"
              >
                <LogOut size={16} className="stroke-destructive" />
                Leave
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditGroupModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} workspace={workspace} />
      <GroupDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} group={{ title: workspace.name, id: workspace.workspaceId }} />
      <CreateInvitationLinkModal isOpen={isLinkOpen} onClose={() => setIsLinkOpen(false)} workspace={workspace} />
      <LeaveWorkspaceModal
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        workspace={workspace}
        onConfirm={handleLeaveConfirm}
        isPending={isLeavePending}
      />
    </>
  );
}