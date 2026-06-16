"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Conversation } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useChatStore } from "@/store/useChatStore";
import { getOrCreateConversation } from "@/service/conversation.service";
import ConversationList from "@/components/dashboard/chat/ConversationList";
import ChatWindow from "@/components/dashboard/chat/ChatWindow";
import { cn } from "@/libs/utils";

export default function ChatPage() {
  const { auth, isHydrated, logout } = useAuth();
  const { conversations, refresh, startChat } = useConversations(auth?.token ?? null);
  const { upsertConversation } = useChatStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  const targetUserId = searchParams.get("target");
  const isMobileChatOpen = !!targetUserId;

  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [hydrating, setHydrating] = useState(false);

  useEffect(() => {
    if (auth) refresh();
  }, [auth]);

  useEffect(() => {
    if (!auth?.token || !targetUserId) {
      setActiveConv(null);
      return;
    }

    const match = conversations.find(
      (c) => String(c.otherUserId).trim() === String(targetUserId).trim(),
    );

    if (match) {
      setActiveConv(match);
      return;
    }

    let cancelled = false;
    setHydrating(true);

    getOrCreateConversation(auth.token, targetUserId)
      .then((conv) => {
        if (cancelled) return;
        upsertConversation(conv);
        setActiveConv(conv);
      })
      .catch(() => {
        if (!cancelled) setActiveConv(null);
      })
      .finally(() => {
        if (!cancelled) setHydrating(false);
      });

    return () => { cancelled = true; };
  }, [targetUserId, auth?.token, conversations]);

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
        <span className="text-3xl">🔒</span>
        <h3 className="font-semibold text-gray-700">Session required</h3>
        <p className="text-xs text-gray-400">Please sign in to access chat.</p>
      </div>
    );
  }

  const handleSelectConversation = (conv: Conversation) => {
    router.push(`/chat?target=${conv.otherUserId}`);
  };

  const handleBack = () => {
    router.push("/chat");
  };

  const handleNewChat = async (uuid: string) => {
    const conv = await startChat(uuid);
    if (conv) router.push(`/chat?target=${conv.otherUserId}`);
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
          conversations={conversations}
          activeId={activeConv?.id ?? null}
          myName={auth.name}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          onLogout={logout}
        />
      </div>

      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 bg-gray-50 relative h-full z-10 pointer-events-auto",
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
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">
              💬
            </div>
            <h3 className="text-md font-semibold text-gray-800">No conversation selected</h3>
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
            onConversationUpdate={refresh}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}