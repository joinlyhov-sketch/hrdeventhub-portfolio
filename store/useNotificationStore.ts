"use client";

import { create } from "zustand";
import { NotificationPayload } from "@/types/notification";
import { notificationService } from "@/service/notification.service";

const MAX_NOTIFICATIONS = 50;

interface NotificationStore {
  notifications: NotificationPayload[];
  unreadCount: number;

  setToken: (token: string) => void;

  addNotification: (n: NotificationPayload) => void;
  hydrateNotifications: (items: NotificationPayload[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  removeNotificationByPostId: (postId: string) => void;
  clearAll: () => void;
  
  clearChatNotificationsForUser: (actorName: string) => void;

  _token: string | null;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  _token: null,

  setToken: (token) => set({ _token: token }),

  addNotification: (n) => {
    set((state) => {
      const exists = state.notifications.some(
        (x) => x.notificationId === n.notificationId
      );
      if (exists) return state;

      const updated = [n, ...state.notifications].slice(0, MAX_NOTIFICATIONS);
      return {
        notifications: updated,
        unreadCount: updated.filter((x) => !x.read).length,
      };
    });
  },

  hydrateNotifications: (items) => {
    const deduped = items.slice(0, MAX_NOTIFICATIONS);
    set({
      notifications: deduped,
      unreadCount: deduped.filter((x) => !x.read).length,
    });
  },

  markRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.notificationId === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((x) => !x.read).length,
      };
    });

    const token = get()._token;
    if (token) {
      notificationService
        .markRead(id, token)
        .catch((err) => console.error("[Notifications] markRead failed", err));
    }
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));

    const token = get()._token;
    if (token) {
      notificationService
        .markAllRead(token)
        .catch((err) => console.error("[Notifications] markAllRead failed", err));
    }
  },

  removeNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter(
        (n) => n.notificationId !== id
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((x) => !x.read).length,
      };
    });
  },

  removeNotificationByPostId: (postId) => {
    set((state) => {
      const updated = state.notifications.filter(
        (n) => n.postId !== postId
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((x) => !x.read).length,
      };
    });
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  clearChatNotificationsForUser: (actorName) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.type === "NEW_MESSAGE" && n.actorName === actorName
          ? { ...n, read: true }
          : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((x) => !x.read).length,
      };
    });
  },
}));