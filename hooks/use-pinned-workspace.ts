"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "pinned_workspace_id";

function getStoredId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

function saveId(id: string | null) {
  if (id) {
    localStorage.setItem(STORAGE_KEY, id);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function usePinnedWorkspaces() {
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  useEffect(() => {
    setPinnedId(getStoredId());
  }, []);

  const isPinned = useCallback(
    (workspaceId: string) => pinnedId === workspaceId,
    [pinnedId],
  );

  const togglePin = useCallback((workspaceId: string) => {
    setPinnedId((prev) => {
      const next = prev === workspaceId ? null : workspaceId;
      saveId(next);
      return next;
    });
  }, []);

  return { pinnedId, isPinned, togglePin };
}