import { useState, useEffect, useCallback } from "react";
import { getCommentsAction } from "@/actions/comment.action";
import { Comment } from "@/types/comment";

export function usePostComments(postId: string, showComments: boolean) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(showComments);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCommentsAction(postId);

      if (result.ok && result.payload) {
        setComments(result.payload);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch comments");
        setComments([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId && showComments) {
      queueMicrotask(() => { fetchComments(); });
    }
  }, [postId, showComments, fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
}
