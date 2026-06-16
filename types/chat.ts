export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  status: "online" | "offline";
}

export interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}
