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

export interface ArticleData {
  id: string;
  author: Author;
  title: string;
  bodyText: string;
  attachmentLink: string;
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

export const initialArticleMockData: ArticleData = {
  id: "art-1102",
  author: {
    name: "Dita Rector",
    avatar: "https://i.pravatar.cc/150?u=dita",
    role: "Organizer",
    date: "01/05/2026 20:25",
  },
  title: "Khmer Food Competition & Sangkran",
  bodyText:
    "Dear everyone, You can find your photo of the event today here. Thank you.",
  attachmentLink:
    "https://drive.google.com/drive/folders/1U12M0y6B9uH_cWObkR_zpgm5iopHLYX6",
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