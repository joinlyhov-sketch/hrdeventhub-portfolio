export interface CreateArticleResponse {
  success: boolean;
  message: string;
  status: string;
  payload: ArticlePayload;
  timestamp: string;
}

export interface ArticlePayload {
  postId: string;
  category: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  media: ArticleMedia[];
  comments: ArticleComment[];
  creator: ArticleCreator;
  pinned: boolean;
  published: boolean;
}

export interface ArticleMedia {
  mediaId?: string;
  filePath: string;
  isCover: boolean;
  createdAt?: string;
}

export interface ArticleComment {
  commentId?: string;
  content?: string;
  createdAt?: string;
}

export interface ArticleCreator {
  userId: string;
  fullName: string;
  profilePicture: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: string;
  payload: T;
  timestamp: string;
}
export interface ArticlePost {
  postId: string;
  category: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  media: ArticleMedia[];
  comments: ArticleComment[];
  creator: ArticleCreator;
  pinned: boolean;
  published: boolean;
}

export interface CreatedArticlePost {
  postId: string;
  category: string;
  title: string;
  content: string;

  createdAt: string;
  updatedAt: string;

  appUserId: string;

  published: boolean;
  pinned: boolean;
}

export interface CreateArticleResponseV2 {
  success: boolean;
  message: string;
  status: string;

  payload?: CreatedArticlePost;

  timestamp: string;
}
