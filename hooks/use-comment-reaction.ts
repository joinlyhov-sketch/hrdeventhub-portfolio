import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/context/user-context";
import { reactionService } from "@/service/post-reaction.service";

export type CommentReactionItem = {
  reactionId: string;
  type: string;
  createdAt: string;
  commentId: string;
  reactor: {
    appUserId: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
};

type CommentReactionResponse = {
  success: boolean;
  payload: CommentReactionItem[];
};

export function useCommentReaction(commentId: string) {
  const { currentUser } = useCurrentUser();
  const { data: session, status } = useSession();

  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [reactionPayload, setReactionPayload] = useState<CommentReactionItem[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!currentUser?.id || !commentId || !session?.accessToken) return;

    const fetchReaction = async () => {
      try {
        const data = (await reactionService.getReactionComment(
          commentId,
          session.accessToken,
        )) as CommentReactionResponse;

        setReactionPayload(data.payload ?? []);
        setLikesCount(data.payload.length);

        const userReaction = data.payload?.find(
          (r) => r.reactor.appUserId === currentUser.id,
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
    setReactionPayload((prev) =>
      isCurrentlyActive
        ? prev.filter((r) => r.reactor.appUserId !== currentUser?.id)
        : [
            ...prev,
            {
              reactionId: "temp",
              type: "like",
              createdAt: "",
              commentId,
              reactor: { appUserId: currentUser?.id ?? "", firstName: currentUser?.name?.split(" ")[0] ?? "", lastName: currentUser?.name?.split(" ").slice(1).join(" ") ?? "", profileImage: currentUser?.profilePicture ?? "" },
            },
          ],
    );

    try {
      if (isCurrentlyActive) {
        await reactionService.removeReactionComment(commentId, session.accessToken);
      } else {
        await reactionService.reactComment(commentId, "like", session.accessToken);
      }
    } catch (err) {
      console.error("Failed to toggle comment reaction:", err);
      setSelectedReaction(isCurrentlyActive ? "like" : null);
      setLikesCount((prev) => (isCurrentlyActive ? prev + 1 : prev - 1));
      setReactionPayload((prev) =>
        isCurrentlyActive
          ? [
              ...prev,
              {
                reactionId: "temp",
                type: "like",
                createdAt: "",
                commentId,
                reactor: { appUserId: currentUser?.id ?? "", firstName: currentUser?.name?.split(" ")[0] ?? "", lastName: currentUser?.name?.split(" ").slice(1).join(" ") ?? "", profileImage: currentUser?.profilePicture ?? "" },
              },
            ]
          : prev.filter((r) => r.reactor.appUserId !== currentUser?.id),
      );
    }
  };

  const handleReactionSelect = async (reactionId: string) => {
    if (!session?.accessToken || !commentId) return;

    const wasAlreadyActive = !!selectedReaction;
    const previousReaction = selectedReaction;

    setSelectedReaction(reactionId);
    setReactionPayload((prev) => {
      const without = prev.filter((r) => r.reactor.appUserId !== currentUser?.id);
      return [
        ...without,
        {
          reactionId: "temp",
          type: reactionId,
          createdAt: "",
          commentId,
          reactor: { appUserId: currentUser?.id ?? "", firstName: currentUser?.name?.split(" ")[0] ?? "", lastName: currentUser?.name?.split(" ").slice(1).join(" ") ?? "", profileImage: currentUser?.profilePicture ?? "" },
        },
      ];
    });
    if (!wasAlreadyActive) setLikesCount((prev) => prev + 1);

    try {
      if (wasAlreadyActive) {
        await reactionService.removeReactionComment(commentId, session.accessToken);
      }
      await reactionService.reactComment(commentId, reactionId, session.accessToken);
    } catch (err) {
      console.error("Failed to select comment reaction:", err);
      setSelectedReaction(previousReaction);
      setReactionPayload((prev) => {
        const without = prev.filter((r) => r.reactor.appUserId !== currentUser?.id);
        return previousReaction
          ? [
              ...without,
              {
                reactionId: "temp",
                type: previousReaction,
                createdAt: "",
                commentId,
                reactor: { appUserId: currentUser?.id ?? "", firstName: currentUser?.name?.split(" ")[0] ?? "", lastName: currentUser?.name?.split(" ").slice(1).join(" ") ?? "", profileImage: currentUser?.profilePicture ?? "" },
              },
            ]
          : without;
      });
      if (!wasAlreadyActive) setLikesCount((prev) => prev - 1);
    }
  };

  return {
    selectedReaction,
    likesCount,
    reactionPayload,
    handleLikeToggle,
    handleReactionSelect,
  };
}