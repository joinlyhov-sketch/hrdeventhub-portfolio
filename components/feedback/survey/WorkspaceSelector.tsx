"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react"; // Imported Lock icon for clarity
import { workspaceService } from "../../../service/workspace.service";
import { Workspace } from "../../../types/survey";
import { Label } from "../../ui/label";
import { getSession } from "next-auth/react";

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
        const token = session?.accessToken || (session?.user as any)?.token;

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
        <div className="relative w-full">
          <select
            id="workspace-select"
            value={selectedWorkspaceId}
            onChange={(e) => onSelectWorkspace(e.target.value)}
            required={required}
            disabled={disabled}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all appearance-none ${
              disabled
                ? "bg-slate-50 border-gray-200 text-gray-500 cursor-not-allowed opacity-90"
                : ""
            }`}
          >
            <option value="">-- Select a workspace --</option>
            {workspaces.map((workspace) => (
              <option key={workspace.workspaceId} value={workspace.workspaceId}>
                {workspace.name}
                {workspace.generationName && ` (${workspace.generationName})`}
              </option>
            ))}
          </select>

          {!disabled && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
