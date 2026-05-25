export type CommentUser = {
  id: number;
  authorName: string;
};

export type CommentItem = {
  id: number;
  content: string;
  user: CommentUser;
};
