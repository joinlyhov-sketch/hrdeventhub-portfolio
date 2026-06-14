"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { logoutAction } from "@/actions/auth.action";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

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

  return <>{children}</>;
}
