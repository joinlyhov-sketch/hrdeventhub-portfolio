export type CommentUser = {
  id: number;
  authorName: string;
};

export type CommentItem = {
  id: number;
  content: string;
  user: CommentUser;
};

const comments: CommentItem[] = [
  {
    id: 1,
    user: {
      id: 1,
      authorName: "Alex Rivera",
    },
    content: "Is there a live stream link?",
  },
  {
    id: 2,
    user: {
      id: 2,
      authorName: "Sarah Chen",
    },
    content: "Great event! Looking forward to it.",
  },
];
