import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/context/user-context";
import { reactionService } from "@/service/post-reaction.service";

type PostReactionResponse = {
  success: boolean;
  payload: {
    reactionId: string;
    type: string;
    createdAt: string;
    postId: string;
    appUserId: string;
  }[];
};

export function usePostReaction(postId: string, initialLikesCount = 0) {
  const { currentUser } = useCurrentUser();
  const { data: session, status } = useSession();

  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!currentUser?.id || !postId || !session?.accessToken) return;

    const fetchUserReaction = async () => {
      try {
        const data = (await reactionService.getReactionPost(
          postId,
          session.accessToken,
        )) as PostReactionResponse;

        const userReaction = data.payload?.find(
          (r) => r.appUserId === currentUser.id,
        );

        setLikesCount(data.payload.length);
        if (userReaction) {
          setSelectedReaction(userReaction.type);
        }
      } catch (err) {
        console.error("Failed to fetch post reaction:", err);
      }
    };

    fetchUserReaction();
  }, [currentUser?.id, postId, session?.accessToken, status]);

  const handleLikeToggle = async () => {
    if (!session?.accessToken || !postId) return;

    const isCurrentlyActive = !!selectedReaction;

    setSelectedReaction(isCurrentlyActive ? null : "like");
    setLikesCount((prev) => (isCurrentlyActive ? prev - 1 : prev + 1));

    try {
      if (isCurrentlyActive) {
        await reactionService.removeReactionPost(postId, session.accessToken);
      } else {
        await reactionService.reactPost(postId, "like", session.accessToken);
      }
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
      setSelectedReaction(isCurrentlyActive ? "like" : null);
      setLikesCount((prev) => (isCurrentlyActive ? prev + 1 : prev - 1));
    }
  };

  const handleReactionSelect = async (reactionId: string) => {
    if (!session?.accessToken || !postId) return;

    const wasAlreadyActive = !!selectedReaction;
    const previousReaction = selectedReaction;

    setSelectedReaction(reactionId);
    if (!wasAlreadyActive) setLikesCount((prev) => prev + 1);

    try {
      if (wasAlreadyActive) {
        await reactionService.removeReactionPost(postId, session.accessToken);
      }
      await reactionService.reactPost(postId, reactionId, session.accessToken);
    } catch (err) {
      console.error("Failed to select reaction:", err);
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