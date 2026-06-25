"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useMyWorkspaces } from "@/hooks/use-my-workspace";
import { useNotificationListener } from "@/hooks/use-notification-socket";
import { useNotificationStore } from "@/store/useNotificationStore";
import { notificationService } from "@/service/notification.service";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const { workspaces } = useMyWorkspaces();
  const workspaceIds = useMemo(
    () => workspaces.map((w) => w.workspaceId).filter(Boolean),
    [workspaces],
  );

  useNotificationListener(workspaceIds);

  const { setToken, hydrateNotifications } = useNotificationStore();

  useEffect(() => {
    if (!token) return;

    setToken(token);

    notificationService
      .getMyNotifications(token)
      .then(hydrateNotifications)
      .catch((err) => console.error("[Notifications] hydration failed", err));
  }, [token, setToken, hydrateNotifications]);

  return <>{children}</>;
}
