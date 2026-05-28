export interface Author {
  name: string;
  avatar: string;
  role?: string;
  date?: string;
  initials?: string;
}

export interface Reply {
  id: string;
  author: Author;
  date: string;
  text: string;
  isOwn?: boolean;
}

export interface Comment {
  id: string;
  author: Author;
  date: string;
  text: string;
  replies?: Reply[];
}

export interface Reaction {
  id: string;
  label: string;
  displayText: string;
  color: string;
}

export interface Creator {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Event {
  id: string;
  title: string;
  bannerUrl: string;
  creator: Creator;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  createdAt: string;
  badge: string;
  description: string;
  location: string;
  dateString: string;
  purpose: string;
  innerBannerTitle: string;
  innerBannerMeta: string;
  role?: string;
}

export const initialMockData: Event = {
  id: "evt-9921",
  title: "Songkran Festival Celebration",
  bannerUrl: "/images/PinnedCardTest.jpg",
  creator: {
    id: "user-1",
    name: "Dita Rector",
    avatarUrl: "https://i.pravatar.cc/150?u=hr",
  },
  likesCount: 124,       
  commentsCount: 18,
  isLikedByUser: false, 
  createdAt: "Posted 2 hours ago",
  badge: "NEW EVENT",
  description: "Join us for our annual Songkran Festival Celebration! Enjoy traditional water festivities, delicious food, and cultural performances with your colleagues.",
  location: "HRD Center",
  dateString: "Tomorrow, 1:30 PM - 5:00 PM",
  purpose: "Cultural Celebration & Team Bonding",
  innerBannerTitle: "Songkran Festival Celebration",
  innerBannerMeta: "Tomorrow, 1:30 PM - 5:00 PM • HRD Center",
  role: "Admin",
};

export const mockComments: Comment[] = [
  {
    id: "c1",
    author: {
      name: "Lyhov",
      avatar: "https://i.pravatar.cc/150?u=lyhov",
      initials: "LY",
    },
    date: "2h ago",
    text: "Really excited for this event. Is anyone else joining from 12th gen?",
    replies: [
      {
        id: "r1",
        author: {
          name: "Dine",
          avatar: "https://i.pravatar.cc/150?u=dine",
        },
        date: "1h ago",
        text: "Is there a live stream link? @rectordita",
        isOwn: true,
      },
      {
        id: "r2",
        author: {
          name: "Dita Rector",
          avatar: "https://i.pravatar.cc/150?u=dita",
        },
        date: "30min ago",
        text: "@dinety I think there is",
        isOwn: true,
      },
    ],
  },
];