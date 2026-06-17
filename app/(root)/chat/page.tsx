"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Conversation } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useChatStore } from "@/store/useChatStore";
import ConversationList from "@/components/site/chat/ConversationList";
import ChatWindow from "@/components/site/chat/ChatWindow";
import { cn } from "@/libs/utils";

export default function ChatPage() {
  const { auth, isHydrated, logout } = useAuth();
  const { conversations, refresh, startChat } = useConversations(
    auth?.token ?? null,
  );
  const { upsertConversation } = useChatStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  const targetUsername = searchParams.get("target");
  const isMobileChatOpen = !!targetUsername;

  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [hydrating, setHydrating] = useState(false);


  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  const stableRefresh = useCallback((delay = 0) => {
  if (delay > 0) {
    setTimeout(() => refreshRef.current(), delay);
  } else {
    refreshRef.current();
  }
  }, []);

  useEffect(() => {
    if (auth) refresh();
  }, [auth]);

  useEffect(() => {
    if (!auth?.token || !targetUsername) {
      setActiveConv(null);
      return;
    }

    const match = conversations.find(
      (c) =>
        String(c.otherUserName ?? "").trim().toLowerCase() ===
        String(targetUsername).trim().toLowerCase(),
    );

    if (match) {
      setActiveConv(match);
      return;
    }

    let cancelled = false;
    setHydrating(true);
    startChat(targetUsername)
      .then((conv) => {
        if (cancelled || !conv) return;
        upsertConversation(conv);
        setActiveConv(conv);
      })
      .catch(() => {
        if (!cancelled) setActiveConv(null);
      })
      .finally(() => {
        if (!cancelled) setHydrating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [targetUsername, auth?.token]);

  if (!isHydrated) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <p className="text-sm text-gray-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-10">
        <h3 className="font-semibold text-gray-700">Session required</h3>
        <p className="text-xs text-gray-400">Please sign in to access chat.</p>
      </div>
    );
  }

 const handleSelectConversation = (conv: Conversation) => {

  if (conv.unreadCount > 0) {
    useChatStore.getState().markRead(conv.id, auth!.userId);
  }
  router.push(`/chat?target=${conv.otherUserName}`);
};

  const handleBack = () => {
    router.push("/chat");
  };

  const handleNewChat = async (username: string) => {
    const conv = await startChat(username);
    if (conv) router.push(`/chat?target=${conv.otherUserName}`);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full antialiased bg-white overflow-hidden relative z-10 pointer-events-auto">
      <div
        className={cn(
          "w-full md:w-80 flex-shrink-0 border-r border-gray-200 h-full flex flex-col relative z-20 bg-white pointer-events-auto",
          isMobileChatOpen ? "hidden md:flex" : "flex",
        )}
      >
        <ConversationList
          conversations={conversations ?? []}
          activeId={activeConv?.id ?? null}
          myName={auth.name}
          token={auth.token}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
        />
      </div>

      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 bg-white relative h-full z-10 pointer-events-auto",
          !isMobileChatOpen ? "hidden md:flex" : "flex",
        )}
      >
        {hydrating ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-xs text-gray-400 animate-pulse font-medium">
              Loading conversation...
            </p>
          </div>
        ) : !activeConv ? (
          <div className="hidden md:flex flex-col items-center justify-center flex-1 p-6 text-center">
            <h3 className="text-md font-semibold text-gray-800">
              No conversation selected
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              Select a conversation from the sidebar or start a new one.
            </p>
          </div>
        ) : (
          <ChatWindow
            key={activeConv.id}
            conversation={activeConv}
            token={auth.token}
            userId={auth.userId}
            userName={auth.name}
            onConversationUpdate={stableRefresh}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}