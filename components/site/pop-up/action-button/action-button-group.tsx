"use client";
import React, { useState } from "react";
import { SquarePen, Trash2, Link2, MoreHorizontal } from "lucide-react";
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
import { Workspace } from "@/types/workspace-type/group";

interface GroupDropDownProps {
  workspace: Workspace;
}

export default function GroupDropDown({ workspace }: GroupDropDownProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);

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
        <DropdownMenuContent
          className="w-40 bg-card p-1.5 border border-border rounded-xl shadow-md flex flex-col gap-1"
          align="end"
        >
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary cursor-pointer transition-colors"
            >
              <SquarePen size={16} className="stroke-primary" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); setIsDeleteOpen(true); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive cursor-pointer transition-colors"
            >
              <Trash2 size={16} className="stroke-destructive" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); setIsLinkOpen(true); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-action hover:bg-action/10 focus:bg-action/10 hover:text-action focus:text-action cursor-pointer transition-colors"
            >
              <Link2 size={16} className="stroke-action" />
              Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditGroupModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} workspace={workspace} />
      <GroupDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        group={{ title: workspace.name, id: workspace.workspaceId }}
      />
      <CreateInvitationLinkModal
  isOpen={isLinkOpen}
  onClose={() => setIsLinkOpen(false)}
  workspace={workspace}
/>
    </>
  );
}