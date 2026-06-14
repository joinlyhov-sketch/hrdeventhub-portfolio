export interface FeedItemWrapper {
  id: string;
  type: "POST" | "POLL" | "SURVEY";
  subType: "article" | "announcement" | "event" | "poll" | "survey";
  title: string;
  description: string;
  createdAt: string;
  new: boolean;
  data: unknown;
}

export interface WorkspaceFeedApiResponse {
  success: boolean;
  message: string;
  status: string;
  payload: FeedItemWrapper[];
}