"use client";

import { ReactNode } from "react";
import { useMyWorkspaces } from "@/hooks/use-my-workspace";
import { useNotificationListener } from "@/hooks/use-notification-socket";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { workspaces } = useMyWorkspaces();
  const workspaceIds = workspaces.map((w) => w.workspaceId).filter(Boolean);

  useNotificationListener(workspaceIds);

  return <>{children}</>;
}
