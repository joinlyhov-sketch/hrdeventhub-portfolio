import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/context/user-context";
import { reactionService } from "@/service/post-reaction.service";

type CommentReactionResponse = {
  success: boolean;
  payload: {
    reactionId: string;
    type: string;
    createdAt: string;
    commentId: string;
    appUserId: string;
  }[];
};

export function useCommentReaction(commentId: string) {
  const { currentUser } = useCurrentUser();
  const { data: session, status } = useSession();

  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!currentUser?.id || !commentId || !session?.accessToken) return;

    const fetchReaction = async () => {
      try {
        const data = (await reactionService.getReactionComment(
          commentId,
          session.accessToken,
        )) as CommentReactionResponse;

        setLikesCount(data.payload.length);

        const userReaction = data.payload?.find(
          (r) => r.appUserId === currentUser.id,
        );
        if (userReaction) setSelectedReaction(userReaction.type);
      } catch (err) {
        console.error("Failed to fetch comment reaction:", err);
      }
    };

    fetchReaction();
  }, [currentUser?.id, commentId, session?.accessToken, status]);

  const handleLikeToggle = async () => {
    if (!session?.accessToken || !commentId) return;

    const isCurrentlyActive = !!selectedReaction;

    setSelectedReaction(isCurrentlyActive ? null : "like");
    setLikesCount((prev) => (isCurrentlyActive ? prev - 1 : prev + 1));

    try {
      if (isCurrentlyActive) {
        await reactionService.removeReactionComment(
          commentId,
          session.accessToken,
        );
      } else {
        await reactionService.reactComment(
          commentId,
          "like",
          session.accessToken,
        );
      }
    } catch (err) {
      console.error("Failed to toggle comment reaction:", err);
      setSelectedReaction(isCurrentlyActive ? "like" : null);
      setLikesCount((prev) => (isCurrentlyActive ? prev + 1 : prev - 1));
    }
  };

  const handleReactionSelect = async (reactionId: string) => {
    if (!session?.accessToken || !commentId) return;

    const wasAlreadyActive = !!selectedReaction;
    const previousReaction = selectedReaction;

    setSelectedReaction(reactionId);
    if (!wasAlreadyActive) setLikesCount((prev) => prev + 1);

    try {
      if (wasAlreadyActive) {
        await reactionService.removeReactionComment(
          commentId,
          session.accessToken,
        );
      }
      await reactionService.reactComment(
        commentId,
        reactionId,
        session.accessToken,
      );
    } catch (err) {
      console.error("Failed to select comment reaction:", err);
      setSelectedReaction(previousReaction);
      if (!wasAlreadyActive) setLikesCount((prev) => prev - 1);
    }
  };

  return {
    selectedReaction,
    likesCount,
    handleLikeToggle,
    handleReactionSelect,
  };
}
