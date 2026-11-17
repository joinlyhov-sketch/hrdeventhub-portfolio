"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { logoutAction } from "@/actions/auth.action";
import { DEMO_MODE } from "@/libs/demo/config";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      if (session.refreshToken) {
        logoutAction(session.refreshToken).finally(() => {
          signOut({ callbackUrl: "/login" });
        });
      } else {
        signOut({ callbackUrl: "/login" });
      }
    }
  }, [session?.error, session?.refreshToken]);

  const isRefreshing = useRef(false);

  useEffect(() => {
    if (DEMO_MODE) return;
    if (session?.accessTokenExpiry && session?.error !== "RefreshTokenExpired") {
      const timeRemaining = session.accessTokenExpiry - Date.now();
      
      const triggerUpdate = async () => {
        if (isRefreshing.current) return;
        isRefreshing.current = true;
        try {
          await update();
        } finally {
          isRefreshing.current = false;
        }
      };

      // If token expires in less than 2 minutes (or already expired), refresh immediately
      if (timeRemaining < 2 * 60 * 1000) {
        triggerUpdate();
      } else if (timeRemaining >= 2 * 60 * 1000) {
        // Otherwise, set a timer to refresh it 1 minute before it expires
        const timeoutDuration = timeRemaining - 60 * 1000;
        const timeoutId = setTimeout(() => {
          triggerUpdate();
        }, timeoutDuration);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [session?.accessTokenExpiry, session?.error, update]);

  return <>{children}</>;
}
