export type UserRole = "Admin" | "Organizer" | "Student" | "Alumni";
export type RegistrationStatus = "NOT_REGISTERED" | "REGISTERED" | "ADMIN_VIEW";

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  generation: number;
}

export interface CommentReply {
  id: string;
  user: UserProfile;
  text: string;
  timestamp: string;
  likes: number;
}

export interface EventComment {
  id: string;
  user: UserProfile;
  text: string;
  timestamp: string;
  likes: number;
  replies: CommentReply[];
}

export interface HRDEvent {
  id: string;
  creator: UserProfile;
  postTitle: string; 
  eventTitle: string; 
  description: string;
  bannerUrl: string;
  date: string;
  time: string;
  location: string;
  joinedCount: number;
  joinedUserAvatars: string[];
  likesCount: number;
  commentsCount: number;
  shareCount: number;
  price: number; 
  isPaid: boolean;
  currentUserAvatarUrl: string;
  currentUserStatus: RegistrationStatus;
  comments: EventComment[];
}

export const CURRENT_USER: UserProfile = {
  id: "user-mak",
  name: "mak",
  avatarUrl:
    "https://i.pinimg.com/736x/94/04/37/940437adff158310cf9919cafa3ed655.jpg",
  role: "Student",
  generation: 14,
};

export const MOCK_EVENTS: HRDEvent[] = [
  {
    id: "83bd51d6-4669-4d53-a04e-17759869c06c",
    creator: {
      id: "von-tavann",
      name: "Von Tavann",
      avatarUrl:
        "https://i.pinimg.com/736x/59/53/c9/5953c977a5d8e7f7cd2ababc1e286b84.jpg",
      role: "Admin",
      generation: 0,
    },
    postTitle: "Calling for HRD Alumni !",
    eventTitle: "Sports Reunion Event",
    description:
      "Join us for an exciting reunion bringing together HRD alumni from all generations! This is a great opportunity to reconnect with old friends, share experiences, and build lasting networks within the HRD community.",
    bannerUrl:
      "https://scontent.fpnh10-1.fna.fbcdn.net/v/t39.30808-6/642407859_1355403639963021_2089671097789557486_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFafTyIshiInHYlUBGtbGh9CZIqtScIFzQJkiq1JwgXNDO1AE6nCEvsSjhiy2Es1GwMijXWifq-JZBjvLekCUHb&_nc_ohc=18fYiGp2okcQ7kNvwFOrBSE&_nc_oc=AdpMI0yqiCxn0WDB-Qnj8uyFbDGWkOgeadcFBjaPc84ukDTyZZQDIxJwhmlnGOhcyf0&_nc_zt=23&_nc_ht=scontent.fpnh10-1.fna&_nc_gid=FahLUTN_FEW4UJ6Nemtbmg&_nc_ss=7b2a8&oh=00_Af7u2QuPVbsG0qTKsN0k40vXQQ3qoQIy-rPQaqyvACbqrA&oe=6A0E0125",
    date: "May 18, 2026",
    time: "9:00 AM",
    location: "Toul Kork, Phnom Penh, Cambodia",
    joinedCount: 32,
    joinedUserAvatars: [
      "https://i.pinimg.com/736x/2d/00/cb/2d00cbe2cafb46f6a255a193487d9848.jpg",
      "https://i.pinimg.com/736x/8d/b1/8c/8db18c35b760761abd3d14bb69c3883e.jpg",
      "https://i.pinimg.com/1200x/7b/33/16/7b3316136216ac09734ffd91311a451d.jpg",
      "https://i.pinimg.com/736x/27/36/e0/2736e08df188a7d62e4e1f3ce9d2f2bb.jpg",
    ],
    likesCount: 124,
    commentsCount: 18,
    shareCount: 8,
    price: 0,
    isPaid: false,
    currentUserAvatarUrl: "https://i.pinimg.com/736x/da/b6/99/dab69971a54d8a4ad59c187a99188103.jpg",
    currentUserStatus: "REGISTERED",

    comments: [
      {
        id: "comment-1",
        user: {
          id: "lyhov-12",
          name: "Lyhov",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
          role: "Alumni",
          generation: 12,
        },
        text: "Really excited for this event. Is anyone else joining from 12th gen?",
        timestamp: "2h ago",
        likes: 8,
        replies: [
          {
            id: "reply-1",
            user: {
              id: "dine-14",
              name: "Dine",
              avatarUrl:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
              role: "Student",
              generation: 14,
            },
            text: "Is there a live stream link?",
            timestamp: "1h ago",
            likes: 1,
          },
        ],
      },
    ],
  },
];

export interface StatCard {
  title: string;
  value: string;
  iconName: 'BadgeDollarSign' | 'UserRound' | 'UserRoundCheck';
  colorKey: 'primary' | 'action' | 'subtle' | 'secondary';
}

export const mockStatsData: StatCard[] = [
  {
    title: "Total Payment",
    value: "$124,50",
    iconName: "BadgeDollarSign",
    colorKey: "primary",
  },
  {
    title: "Total Attendee",
    value: "69",
    iconName: "UserRound",
    colorKey: "action",
  },
  {
    title: "Today",
    value: "+6",
    iconName: "UserRoundCheck",
    colorKey: "subtle",
  },
  {
    title: "This week",
    value: "+12",
    iconName: "UserRoundCheck",
    colorKey: "secondary",
  }
];
export interface Creator {
  name: string;
  avatarUrl: string;
}

export interface EventDetailState {
  id: string;
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