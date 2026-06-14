"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { workspaceService } from "../../../service/workspace.service";
import { Workspace } from "../../../types/survey";
import { Label } from "../../ui/label";
import { getSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface WorkspaceSelectorProps {
  selectedWorkspaceId: string;
  onSelectWorkspace: (workspaceId: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function WorkspaceSelector({
  selectedWorkspaceId,
  onSelectWorkspace,
  required = true,
  disabled = false,
}: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        const token = session?.accessToken || (session?.user as Record<string, unknown>)?.token as string | undefined;

        if (!token) {
          throw new Error("You are not authenticated. Please log in again.");
        }

        const data = await workspaceService.getAll(token, 1, 100);
        setWorkspaces(data);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch workspaces";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div className="mb-6">
      <Label
        htmlFor="workspace-select"
        className="mb-2 text-sm font-medium flex items-center gap-1.5"
      >
        <span>
          Select Workspace{" "}
          {required && !disabled && <span className="text-red-500">*</span>}
        </span>
        {disabled && <Lock size={13} className="text-muted-foreground" />}
      </Label>

      {loading ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm text-gray-600">Loading workspaces...</span>
        </div>
      ) : error ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">No workspaces available</p>
        </div>
      ) : (
        <Select
          value={selectedWorkspaceId}
          onValueChange={onSelectWorkspace}
          disabled={disabled}
        >
          <SelectTrigger
            id="workspace-select"
            className={`w-full h-11 px-5 py-6 bg-background border-input rounded-xl text-desc md:text-base focus:ring-1 focus:ring-primary focus:ring-offset-0 ${
              disabled
                ? "opacity-90 cursor-not-allowed text-gray-500 bg-slate-50"
                : ""
            }`}
          >
            <SelectValue placeholder="-- Select a workspace --" />
          </SelectTrigger>
          <SelectContent
            side="bottom"
            position="popper"
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-60 w-[var(--radix-select-trigger-width)] overflow-y-auto"
          >
            {workspaces.map((workspace) => (
              <SelectItem
                key={workspace.workspaceId}
                value={workspace.workspaceId}
                className="px-3 py-2.5 text-sm rounded-lg text-gray-700 cursor-pointer focus:bg-slate-100 focus:text-primary"
              >
                {workspace.name}
                {workspace.generationName && ` (${workspace.generationName})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
