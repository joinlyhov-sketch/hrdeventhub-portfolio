"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LeaveUnSaveModal } from "../site/pop-up/LeaveUnSaveModal";

interface NavigationGuardProps {
  isDirty: boolean;
}

export function NavigationGuard({ isDirty }: NavigationGuardProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [shouldGoBack, setShouldGoBack] = useState(false);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        if (
          !href ||
          href.startsWith("http") ||
          href.startsWith("#") ||
          href.startsWith("javascript:")
        ) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        setPendingUrl(href);
        setShouldGoBack(false);
        setIsOpen(true);
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [isDirty]);

  useEffect(() => {
    const handleManualTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{
        fallbackUrl?: string;
        isBack?: boolean;
      }>;

      if (customEvent.detail?.isBack) {
        setShouldGoBack(true);
        setPendingUrl(null);
      } else {
        setPendingUrl(customEvent.detail?.fallbackUrl || "/dashboard");
        setShouldGoBack(false);
      }

      setIsOpen(true);
    };

    window.addEventListener("trigger-unsaved-guard", handleManualTrigger);
    return () =>
      window.removeEventListener("trigger-unsaved-guard", handleManualTrigger);
  }, []);

  const handleConfirmLeave = () => {
    setIsOpen(false);

    if (shouldGoBack) {
      router.back();
    } else if (pendingUrl) {
      router.push(pendingUrl);
    }
  };

  return (
    <LeaveUnSaveModal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setPendingUrl(null);
        setShouldGoBack(false);
      }}
      onConfirm={handleConfirmLeave}
    />
  );
}
