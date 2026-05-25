import { create } from "zustand";

type LogoutModalStore = {
  isOpen: boolean;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
};

export const useLogoutModalStore = create<LogoutModalStore>((set) => ({
  isOpen: false,

  openLogoutModal: () => set({ isOpen: true }),
  closeLogoutModal: () => set({ isOpen: false }),
}));
