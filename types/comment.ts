export type CommentUser = {
  id: string;
  name: string;
};

export type CommentItem = {
  id: string;
  content: string;
  user: CommentUser;
};
