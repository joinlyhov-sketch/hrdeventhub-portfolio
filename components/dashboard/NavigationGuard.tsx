"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { LeaveUnSaveModal } from "../site/pop-up/LeaveUnSaveModal";

interface NavigationGuardProps {
  isDirty: boolean;
  onLeave?: () => void;
}

export function NavigationGuard({ isDirty, onLeave }: NavigationGuardProps) {
  const router = useRouter();
  const param = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [shouldGoBack, setShouldGoBack] = useState(false);

  const isLeavingRef = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty || isLeavingRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      if (isLeavingRef.current) return;

      // Lock position back into place
      window.history.pushState(null, "", window.location.href);

      setShouldGoBack(true);
      setPendingUrl(null);
      setIsOpen(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const handleAnchorClick = (e: MouseEvent) => {
      if (isLeavingRef.current) return;

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
      if (isLeavingRef.current) return;

      const customEvent = e as CustomEvent<{
        fallbackUrl?: string;
        isBack?: boolean;
      }>;

      if (customEvent.detail?.isBack) {
        setShouldGoBack(true);
        setPendingUrl(null);
      } else {
        setPendingUrl(
          customEvent.detail?.fallbackUrl || `/profile/${param.id}`,
        );
        setShouldGoBack(false);
      }

      setIsOpen(true);
    };

    window.addEventListener("trigger-unsaved-guard", handleManualTrigger);
    return () =>
      window.removeEventListener("trigger-unsaved-guard", handleManualTrigger);
  }, [param.id]);

  const handleConfirmLeave = () => {
    isLeavingRef.current = true;
    setIsOpen(false);

    onLeave?.();

    if (shouldGoBack) {
      window.history.go(-2);
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
