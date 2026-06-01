"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { workspaceService } from "../../../service/workspace.service";
import { Workspace } from "../../../types/survey";
import { Label } from "../../ui/label";

interface WorkspaceSelectorProps {
  selectedWorkspaceId: string;
  onSelectWorkspace: (workspaceId: string) => void;
  required?: boolean;
}

export default function WorkspaceSelector({
  selectedWorkspaceId,
  onSelectWorkspace,
  required = true,
}: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const data = await workspaceService.getAll("1", 100);
        setWorkspaces(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch workspaces";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div className="mb-6">
      <Label htmlFor="workspace-select" className="block mb-2 text-sm font-medium">
        Select Workspace {required && <span className="text-red-500">*</span>}
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
        <select
          id="workspace-select"
          value={selectedWorkspaceId}
          onChange={(e) => onSelectWorkspace(e.target.value)}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">-- Select a workspace --</option>
          {workspaces.map((workspace) => (
            <option key={workspace.workspaceId} value={workspace.workspaceId}>
              {workspace.name}
              {workspace.generationName && ` (${workspace.generationName})`}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
