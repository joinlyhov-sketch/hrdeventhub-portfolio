"use client";

import { LucideIcon, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down/dropdown-menu";

export interface DropdownAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface ActionDropdownProps {
  actions: DropdownAction[];
}

export default function ActionDropdown({ actions }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex flex-col justify-center w-20 h-25 bg-card gap-10"
        align="start"
      >
        <DropdownMenuGroup>
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <DropdownMenuItem
                key={action.label}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className="
                  flex items-center gap-3 
                  text-foreground 
                  hover:bg-muted 
                  focus:bg-muted 
                  transition-colors
                  cursor-pointer
                "
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
