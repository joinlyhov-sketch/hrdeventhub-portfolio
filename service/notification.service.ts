import { apiGet, apiPatch } from "@/libs/api";
import { NotificationPayload } from "@/types/notification";

export interface NotificationApiItem {
  notificationId: string;
  recipientId: string;
  type: string;
  workspaceId: string;
  postId?: string;
  postTitle?: string;
  postCategory?: string;
  commentId?: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function toPayload(item: NotificationApiItem): NotificationPayload {
  return {
    notificationId: item.notificationId,
    type: item.type as NotificationPayload["type"],
    workspaceId: item.workspaceId,
    postId: item.postId,
    postTitle: item.postTitle,
    postCategory: item.postCategory,
    mentionedInCommentId: item.commentId,
    actorId: item.actorId,
    actorName: item.actorName,
    actorAvatar: item.actorAvatar,
    message: item.message,
    createdAt: item.createdAt,
    read: item.isRead,
  };
}

export const notificationService = {
  async getMyNotifications(token: string, limit = 50): Promise<NotificationPayload[]> {
    const res = await apiGet<NotificationApiItem[]>(`/notifications?limit=${limit}`, {
      authToken: token,
    });
    const items: NotificationApiItem[] = (res as any)?.payload ?? res ?? [];
    return items.map(toPayload);
  },

  async markRead(notificationId: string, token: string): Promise<void> {
    await apiPatch(`/notifications/${notificationId}/read`, {}, { authToken: token });
  },

  async markAllRead(token: string): Promise<void> {
    await apiPatch(`/notifications/read-all`, {}, { authToken: token });
  },
};