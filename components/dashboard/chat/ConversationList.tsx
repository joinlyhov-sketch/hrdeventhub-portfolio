"use client";

import { useState } from "react";
import { Conversation } from "@/types/chat";
import { initials } from "@/libs/utils";
import { cn } from "@/libs/utils";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  myName: string;
  onSelect: (conv: Conversation) => void;
  onNewChat: (uuid: string) => void;
  onLogout: () => void;
}

export default function ConversationList({
  conversations,
  activeId,
  myName,
  onSelect,
  onNewChat,
}: ConversationListProps) {
  const [uuid, setUuid] = useState("");

  function handleNewChat() {
    if (!uuid.trim()) return;
    onNewChat(uuid.trim());
    setUuid("");
  }

  return (
    <div className="flex flex-col h-full bg-white w-full relative z-10 pointer-events-auto">
      {/* Header Container - 73px matches logo horizontal specification rules */}
      <div className="h-[73px] border-b border-gray-200 flex items-center px-4 flex-shrink-0 bg-white relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {initials(myName)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-gray-900 truncate">{myName}</span>
            <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Input box zone explicitly cleared of overlay traps */}
      <div className="p-4 border-b border-gray-100 bg-white flex-shrink-0 relative z-30 pointer-events-auto">
        <div className="flex gap-2 relative z-30 pointer-events-auto">
          <input
            type="text"
            disabled={false}
            readOnly={false}
            className="flex-1 text-xs border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-900 placeholder:text-gray-400 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all relative z-40 pointer-events-auto cursor-text select-text"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            placeholder="Paste user UUID..."
            onKeyDown={(e) => e.key === "Enter" && handleNewChat()}
          />
          <button 
            type="button"
            onClick={handleNewChat}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0 relative z-40 pointer-events-auto cursor-pointer"
          >
            Chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 relative z-20 pointer-events-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 font-medium">
            No active conversations yet
          </div>
        ) : (
          conversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => onSelect(c)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-4 transition-all text-left border-l-4 outline-none relative z-20 pointer-events-auto",
                  isActive 
                    ? "bg-blue-50/60 border-blue-600" 
                    : "bg-white border-transparent hover:bg-gray-50/80"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {initials(c.otherUserName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-gray-900 truncate">
                      {c.otherUserName ?? "Unknown User"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate pr-2">
                    {c.lastMessage ?? "No messages yet"}
                  </p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm shrink-0">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}