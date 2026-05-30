"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { SquarePen, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down/dropdown-menu";
import { DeleteModal } from "@/components/site/pop-up/commons/DeleteModal";

interface GenericPostDropDownProps {
  id: string | number;
  title: string;
  editUrl: string;
  onDelete: () => void;
}

export default function GenericPostDropDown({
  id,
  title,
  editUrl,
  onDelete,
}: GenericPostDropDownProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();
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
          className="w-40 bg-card p-1.5 border border-border rounded-xl shadow-md flex flex-col gap-1"
          align="end"
        >
          <DropdownMenuGroup className="flex flex-col gap-1">
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
        group={{ id, title }} 
        onConfirm={() => {
          onDelete();
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}