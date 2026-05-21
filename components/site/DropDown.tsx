"use client";

import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/drop-down/dropdown-menu";
import { SquarePen, Trash2, Link2 } from "lucide-react";

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex flex-col justify-center px-2 w-20 h-30 bg-card gap-10"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="
              flex items-center gap-3
              text-primary
              hover:bg-primary/10
              hover:text-primary
              focus:bg-primary/10
              focus:text-primary
            "
          >
            <SquarePen className="stroke-primary" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="
              flex items-center gap-3
              text-destructive
              hover:bg-destructive/10
              hover:text-destructive
              focus:bg-destructive/10
              focus:text-destructive"
          >
            <Trash2 className="stroke-destructive" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem
            className="
              flex items-center gap-3
              text-action
              hover:bg-action/10
              hover:text-action
              focus:bg-action/10
              focus:text-action
            "
          >
            <Link2 className="stroke-action" />
            Link
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
