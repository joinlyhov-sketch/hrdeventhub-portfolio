import { create } from "zustand";
import { NotificationPayload } from "@/types/notification";

const MAX_NOTIFICATIONS = 50;

interface NotificationStore {
  notifications: NotificationPayload[];
  unreadCount: number;

  addNotification: (n: NotificationPayload) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

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
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
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

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
