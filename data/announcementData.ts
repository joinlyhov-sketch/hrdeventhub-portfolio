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

export interface AnnouncementData {
  id: string;
  announcementLabel: string;
  postedTimeText: string;
  author: Author;
  title: string;
  description: string;
  location: string;
  dateString: string;
  purpose: string;
  bannerImage: string;
  innerBannerTitle: string;
  innerBannerMeta: string;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
}

export interface Reaction {
  id: string;
  label: string;
  displayText: string;
  color: string;
}

export const groupData = {
  id: "1",
  groupId: "1",
  badge: "NEW EVENT",
  title: "Songkran Festival Celebration",
  schedule: "Tomorrow, 1:30 PM - 5:00 PM • HRD Center",
};

export const initialAnnouncementMockData: AnnouncementData = {
  id: "ann-7731",
  announcementLabel: "Main Stage Announcement",
  postedTimeText: "Posted 45 mins ago",
  author: {
    name: "Dita Rector",
    avatar: "https://i.pravatar.cc/150?u=dita",
    role: "Organizer",
    date: "01/05/2026 20:25",
  },
  title: "Upcoming Special Lecture !",
  description:
    "Join us to explore the fundamentals of Zero Trust Security and how organizations protect digital systems in today's evolving threat landscape. Learn key principles, modern security strategies, and real-world applications for building safer and smarter networks.",
  location: "Royal University of Phnom Penh",
  dateString: "26th May 2026, 2pm–5pm",
  purpose: "Enhance student's Knowledge in the field of Artificial Intelligence",
  bannerImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200",
  innerBannerTitle: "AI Evolution in Modern Technology Era",
  innerBannerMeta: "CKCC Seminar Room B • Sept 15, 2026",
  likesCount: 124,
  commentsCount: 18,
  isLikedByUser: false,
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