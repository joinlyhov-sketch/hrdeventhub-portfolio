"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SquarePen, Trash2, MoreVertical, Pin, PinOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down/dropdown-menu";
import { DeleteModal } from "@/components/site/pop-up/commons/delete-modal";

const MAX_PINNED = 3;

interface GenericPostDropDownProps {
  title: string;
  editUrl: string;
  onDelete: () => Promise<void> | void;
  isPinned?: boolean;
  pinnedCount?: number;
  onTogglePin?: (currentPinStatus: boolean) => Promise<void> | void;
}

export default function GenericPostDropDown({
  title,
  editUrl,
  onDelete,
  isPinned,
  pinnedCount,
  onTogglePin,
}: GenericPostDropDownProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const hasPinFeature = onTogglePin !== undefined;

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPinFeature) return;
    
    const currentPinned = isPinned ?? false;
    const currentCount = pinnedCount ?? 0;
    
    if (!currentPinned && currentCount >= MAX_PINNED) return;

    startTransition(async () => {
      try {
        await onTogglePin(currentPinned);
      } catch (error) {
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-primary cursor-pointer outline-none focus:outline-none select-none p-1.5 rounded-lg hover:bg-muted/50 transition-colors inline-flex items-center justify-center"
          >
            <MoreVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-44 bg-card p-1.5 border border-border rounded-xl shadow-md flex flex-col gap-1"
          align="end"
        >
          <DropdownMenuGroup className="flex flex-col gap-1">
            {hasPinFeature && (
              <DropdownMenuItem
                onClick={handleTogglePin}
                disabled={isPending || (!(isPinned ?? false) && (pinnedCount ?? 0) >= MAX_PINNED)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-action hover:bg-action/10 focus:bg-action/10 hover:text-action focus:text-action cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPinned ? (
                  <>
                    <PinOff size={16} className="stroke-action" /> Unpin
                  </>
                ) : (
                  <>
                    <Pin size={16} className="stroke-action" />{" "}
                    {(pinnedCount ?? 0) >= MAX_PINNED ? "Pin limit reached" : "Pin Post"}
                  </>
                )}
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(editUrl);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary cursor-pointer transition-colors"
            >
              <SquarePen size={16} className="stroke-primary" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteOpen(true);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive cursor-pointer transition-colors"
            >
              <Trash2 size={16} className="stroke-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={title}
        onConfirm={onDelete}
      />
    </>
  );
}