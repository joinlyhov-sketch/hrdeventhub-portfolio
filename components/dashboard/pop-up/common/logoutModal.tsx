"use client";

import { LogOut } from "lucide-react";
import { useLogoutModalStore } from "../../../../store/useLogoutModalStore";

type Props = {
  onLogout?: () => void;
};

export default function LogoutModal({ onLogout }: Props) {
  const { isOpen, closeLogoutModal } = useLogoutModalStore();

  if (!isOpen) return null;

  function handleLogout() {
    onLogout?.();
    closeLogoutModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-900/30 backdrop-blur-[2px]">
      <div className="w-[860px] rounded-[22px] bg-card px-10 py-20 shadow-[0px_24px_70px_rgba(0,0,0,0.16)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-[68px] items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <LogOut size={32} strokeWidth={2.3} />
          </div>

          <h2 className="mt-6 type-title text-secondary">
            Log out of HRD EventHub?
          </h2>

          <p className="mt-4 max-w-[500px] type-desc-medium text-muted-foreground">
            You will need to sign in again to access your admin dashboard.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={closeLogoutModal}
              className="h-[58px] w-[170px] rounded-[16px] border border-primary bg-card type-desc-medium text-primary transition hover:bg-primary/5"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              className="h-[58px] w-[170px] rounded-[16px] bg-destructive type-desc-medium text-white shadow-[0px_8px_22px_rgba(239,68,68,0.25)] transition hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
