"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Circle,
  ChevronLeft,
} from "lucide-react";
import { ChatContact, Message } from "@/types/chat";
// import { ChatContact, Message } from "../types/chat";

interface ChatContainerProps {
  initialContacts: ChatContact[];
  serverActiveId: string;
}

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      text: "Hey team! Do we have the fresh asset updates for the HRD event hub banners?",
      sender: "them",
      timestamp: "10:30 AM",
    },
    {
      id: "m2",
      text: "Yes, working through the responsive components layouts inside Tailwind right now.",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: "m3",
      text: "Awesome! I've uploaded the final high-fidelity event wireframes for the workspace.",
      sender: "them",
      timestamp: "10:42 AM",
    },
  ],
};

export default function ChatContainer({
  initialContacts,
  serverActiveId,
}: ChatContainerProps) {
  const [contacts, setContacts] = useState<ChatContact[]>(initialContacts);
  const [activeId, setActiveId] = useState<string>(serverActiveId || "1");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);

  // Mobile UI View Control State: 'list' | 'conversation'
  const [mobileView, setMobileView] = useState<"list" | "conversation">(
    serverActiveId ? "conversation" : "list",
  );
  const [isPending, startTransition] = useTransition();

  const activeContact = contacts.find((c) => c.id === activeId);
  const currentMessages = messages[activeId] || [];

  const handleContactSelect = (id: string) => {
    setActiveId(id);
    setMobileView("conversation");

    // Clear unread counts safely upon selection
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );

    /* FUTURE EXTENSION POINT FOR LAZY-FETCHING MESSAGES:
      startTransition(async () => {
         const data = await fetchMessageHistoryAction(id);
         setMessages(prev => ({ ...prev, [id]: data }));
      });
    */
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeId) return;

    const newMsg: Message = {
      id: `m-new-${Date.now()}`,
      text: inputMessage.trim(),
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));

    // Move current thread to top with the new snippet
    setContacts((prev) => {
      const updated = prev.map((c) =>
        c.id === activeId
          ? { ...c, lastMessage: inputMessage.trim(), time: "10:53 AM" }
          : c,
      );
      const targetIndex = updated.findIndex((c) => c.id === activeId);
      if (targetIndex > 0) {
        const [targetItem] = updated.splice(targetIndex, 1);
        return [targetItem, ...updated];
      }
      return updated;
    });

    setInputMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full gap-4 p-2 md:p-4 bg-slate-50">
      {/* 1. CHAT THREADS THREAD LIST PANEL */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${
          mobileView === "conversation" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header Block */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Messages
            </h1>
            <button
              className="p-2 hover:bg-slate-50 text-slate-500 rounded-xl transition-all"
              aria-label="More Options"
            >
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Search Inputs */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 text-sm rounded-xl border border-slate-100 outline-none focus:border-primary/40 focus:bg-white transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Dynamic List Stream */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {contacts.map((contact) => {
            const isSelected = contact.id === activeId;
            return (
              <button
                key={contact.id}
                onClick={() => handleContactSelect(contact.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                  isSelected
                    ? "bg-slate-100/80 border border-slate-200/20 shadow-sm"
                    : "hover:bg-slate-50/60"
                }`}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden relative border border-slate-100">
                    <Image
                      src={contact.avatar}
                      alt={contact.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  {contact.status === "online" && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h2
                      className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-slate-800"}`}
                    >
                      {contact.name}
                    </h2>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2 font-medium">
                      {contact.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-normal leading-relaxed">
                    {contact.lastMessage}
                  </p>
                </div>

                {contact.unreadCount > 0 && (
                  <div className="flex flex-col justify-center items-center h-full self-center pl-1">
                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                      {contact.unreadCount}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHAT CONVERSATION WINDOW MAIN BODY */}
      <div
        className={`flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {activeContact ? (
          <>
            {/* Conversation Headers */}
            <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex justify-between items-center shadow-2xtiny">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Back Navigation Arrow on Mobile Layout Viewports */}
                <button
                  onClick={() => setMobileView("list")}
                  className="p-1.5 mr-1 hover:bg-slate-50 text-slate-500 rounded-lg md:hidden transition-all"
                  aria-label="Back to contacts list"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-slate-100 flex-shrink-0">
                  <Image
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate">
                    {activeContact.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
                    <Circle
                      className={`fill-current ${activeContact.status === "online" ? "text-green-500" : "text-slate-300"}`}
                      size={7}
                    />
                    <span className="capitalize">{activeContact.status}</span>
                  </div>
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="flex items-center gap-0.5 md:gap-1 text-slate-500 flex-shrink-0">
                <button
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                  aria-label="Audio call"
                >
                  <Phone size={18} />
                </button>
                <button
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                  aria-label="Video call"
                >
                  <Video size={18} />
                </button>
                <div className="w-px h-5 bg-slate-100 mx-1 hidden sm:block" />
                <button
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                  aria-label="More conversation tools"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Conversation Core Message Feeds */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/40 space-y-4">
              {currentMessages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl shadow-2xtiny border ${
                        isMe
                          ? "bg-primary text-white border-primary rounded-tr-none"
                          : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400 font-medium">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <CheckCheck size={13} className="text-primary" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Form Messaging Footer composition panel */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 md:p-4 border-t border-slate-100 bg-white flex items-center gap-2 md:gap-3"
            >
              <div className="flex items-center gap-0.5 text-slate-400">
                <button
                  type="button"
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all hover:text-slate-600"
                  aria-label="Attach file"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all hover:text-slate-600 hidden sm:inline-block"
                  aria-label="Insert Emoji"
                >
                  <Smile size={20} />
                </button>
              </div>

              <input
                type="text"
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputMessage(e.target.value)
                }
                placeholder="Write your message here..."
                className="flex-1 py-2.5 px-4 bg-slate-50/80 text-sm border border-slate-100 rounded-xl outline-none focus:border-primary/40 focus:bg-white transition-all text-slate-700"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-primary shadow-sm flex-shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20">
            <p className="text-sm font-medium">
              Select a conversation thread to start collaboration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
