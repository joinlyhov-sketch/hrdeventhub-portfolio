"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { AuthPayload } from "@/types/chat";
import { useChatStore } from "@/store/useChatStore";

export function useAuth() {
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState<AuthPayload | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const s = session as { accessToken?: string; user?: { token?: string } } & typeof session;
      const token = s.accessToken || s.user?.token;

      if (token) {
        try {
          const claims = JSON.parse(atob(token.split(".")[1]));
          const userId = String(claims.userId ?? claims.sub ?? "");
          const name = String(
            claims.firstName && claims.lastName
              ? `${claims.firstName} ${claims.lastName}`
              : claims.username ?? session.user.name ?? session.user.email ?? "",
          );
          setAuth({ token, userId, name });
        } catch (e) {
          console.error("Failed to decode token claims:", e);
        }
      }
    } else if (status === "unauthenticated") {
      setAuth(null);
    }
  }, [session, status]);

  const logout = () => {
    useChatStore.getState().setConversations([]);
    useChatStore.setState({ conversations: [], messages: {} });
    localStorage.removeItem("hrd-chat-v1");
    signOut({ callbackUrl: "/" });
  };

  return {
    auth,
    isHydrated: status !== "loading",
    logout,
    loading: status === "loading",
    error: null,
  };
}