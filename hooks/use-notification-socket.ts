"use no memo";
"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/useNotificationStore";
import {
  WsPostNotification,
  WsMentionNotification,
  NotificationPayload,
} from "@/types/notification";

function buildMessage(raw: WsPostNotification | WsMentionNotification): string {
  switch (raw.type) {
    case "POST_CREATED":
      return `${raw.actorName} posted "${(raw as WsPostNotification).postTitle}" in your workspace.`;
    case "POST_UPDATED":
      return `${raw.actorName} updated "${(raw as WsPostNotification).postTitle}".`;
    case "POST_DELETED":
      return `${raw.actorName} deleted "${(raw as WsPostNotification).postTitle}".`;
    case "MENTION":
      return `${raw.actorName} mentioned you in a comment on "${(raw as WsMentionNotification).postTitle}".`;
    case "SURVEY_CREATED":
      return `${raw.actorName} created a new survey "${(raw as WsPostNotification).postTitle}".`;
    case "POLL_CREATED":
      return `${raw.actorName} created a new poll "${(raw as WsPostNotification).postTitle}".`;
    default:
      return "You have a new notification.";
  }
}

const TOAST_LABELS: Record<string, string> = {
  POST_CREATED: "New Post",
  POST_UPDATED: "Post Updated",
  POST_DELETED: "Post Deleted",
  MENTION: "You were mentioned",
  SURVEY_CREATED: "New Survey",
  POLL_CREATED: "New Poll",
};

function toNotificationPayload(
  raw: WsPostNotification | WsMentionNotification,
): NotificationPayload {
  const base: Partial<NotificationPayload> = {
    notificationId: crypto.randomUUID(),
    type: raw.type,
    workspaceId: raw.workspaceId,
    actorId: raw.actorId,
    actorName: raw.actorName,
    actorAvatar: raw.actorAvatar,
    message: buildMessage(raw),
    createdAt: raw.timestamp ?? new Date().toISOString(),
    read: false,
  };

  if (raw.type === "MENTION") {
    const mention = raw as WsMentionNotification;
    return {
      ...base,
      postId: mention.postId,
      postTitle: mention.postTitle,
      mentionedInCommentId: mention.commentId,
    } as NotificationPayload;
  }

  const post = raw as WsPostNotification;
  return {
    ...base,
    postId: post.postId,
    postTitle: post.postTitle,
    postCategory: post.postCategory,
  } as NotificationPayload;
}

interface UseNotificationSocketOptions {
  workspaceIds: string[];
  appUserId: string | undefined;
  token: string | undefined;
}

export function useNotificationSocket({
  workspaceIds,
  appUserId,
  token,
}: UseNotificationSocketOptions) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;
  const workspaceKey = workspaceIds.join(",");

  useEffect(() => {
    if (!token || !appUserId) return;

    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v5", "");

    const ids = workspaceKey ? workspaceKey.split(",") : [];

    const client = new Client({
      webSocketFactory: () => new SockJS(`${base}/ws?token=${encodeURIComponent(token)}`),
      connectHeaders: {},
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("[WS] Connected. Subscribing to mentions + workspace topics.");
        client.subscribe("/user/queue/mentions", (message) => {
          try {
            const raw: WsMentionNotification = JSON.parse(message.body);
            const payload = toNotificationPayload(raw);
            addNotificationRef.current(payload);
            toast(TOAST_LABELS[raw.type] ?? "Notification", {
              description: payload.message,
              duration: 4000,
            });
          } catch (err) {
            console.error("[WS] /user/queue/mentions parse error", err, message.body);
          }
        });

        ids.forEach((wsId) => {
          console.log("[WS] Subscribing to /topic/workspace/" + wsId + "/notifications");
          client.subscribe(
            `/topic/workspace/${wsId}/notifications`,
            (message) => {
              try {
                const raw: WsPostNotification = JSON.parse(message.body);
                const payload = toNotificationPayload(raw);
                addNotificationRef.current(payload);
                toast(TOAST_LABELS[raw.type] ?? "Notification", {
                  description: payload.message,
                  duration: 4000,
                });
              } catch (err) {
                console.error("[WS] workspace topic parse error", err, message.body);
              }
            },
          );
        });
      },

      onStompError: (frame) => {
        console.error("[WS] STOMP error:", frame.headers["message"], frame.body);
      },

      onDisconnect: () => {
        console.warn("[WS] Disconnected");
      },

      onWebSocketError: (error) => {
        console.error("[WS] WebSocket error:", error);
      },
    });

    client.activate();

    return () => {
      console.log("[WS] Deactivating client");
      client.deactivate();
    };
  }, [token, appUserId, workspaceKey]);
}

export function useNotificationListener(workspaceIds: string[]) {
  const { data: session } = useSession();

  useNotificationSocket({
    workspaceIds,
    appUserId: session?.appUserId,
    token: session?.accessToken as string | undefined,
  });
}