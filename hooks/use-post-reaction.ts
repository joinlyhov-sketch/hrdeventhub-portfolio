import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/context/user-context";
import { reactionService } from "@/service/post-reaction.service";

export type ReactionItem = {
  reactionId: string;
  type: string;
  createdAt: string;
  postId: string;
  reactor: {
    appUserId: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
};

type PostReactionResponse = {
  success: boolean;
  payload: ReactionItem[];
};

export function usePostReaction(postId: string, initialLikesCount = 0) {
  const { currentUser } = useCurrentUser();
  const { data: session, status } = useSession();

  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [reactionPayload, setReactionPayload] = useState<ReactionItem[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!currentUser?.id || !postId || !session?.accessToken) return;

    const fetchUserReaction = async () => {
      try {
        const data = (await reactionService.getReactionPost(
          postId,
          session.accessToken,
        )) as PostReactionResponse;

        setReactionPayload(data.payload ?? []);
        setLikesCount(data.payload.length);

        const userReaction = data.payload?.find(
          (r) => r.reactor.appUserId === currentUser.id,
        );
        if (userReaction) setSelectedReaction(userReaction.type);
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
    setReactionPayload((prev) =>
      isCurrentlyActive
        ? prev.filter((r) => r.reactor.appUserId !== currentUser?.id)
        : [
            ...prev,
            {
              reactionId: "temp",
              type: "like",
              createdAt: "",
              postId,
              reactor: { appUserId: currentUser?.id ?? "", firstName: currentUser?.name?.split(" ")[0] ?? "", lastName: currentUser?.name?.split(" ").slice(1).join(" ") ?? "", profileImage: currentUser?.profilePicture ?? "" },
            },
          ],
    );

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
      setReactionPayload((prev) =>
        isCurrentlyActive
          ? [
              ...prev,
              {
                reactionId: "temp",
                type: "like",
                createdAt: "",
                postId,
                reactor: { appUserId: currentUser?.id ?? "", firstName: currentUser?.name?.split(" ")[0] ?? "", lastName: currentUser?.name?.split(" ").slice(1).join(" ") ?? "", profileImage: currentUser?.profilePicture ?? "" },
              },
            ]
          : prev.filter((r) => r.reactor.appUserId !== currentUser?.id),
      );
    }
  };

  const handleReactionSelect = async (reactionId: string) => {
    if (!session?.accessToken || !postId) return;

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
          postId,
          reactor: { appUserId: currentUser?.id ?? "", firstName: currentUser?.name?.split(" ")[0] ?? "", lastName: currentUser?.name?.split(" ").slice(1).join(" ") ?? "", profileImage: currentUser?.profilePicture ?? "" },
        },
      ];
    });
    if (!wasAlreadyActive) setLikesCount((prev) => prev + 1);

    try {
      if (wasAlreadyActive) {
        await reactionService.removeReactionPost(postId, session.accessToken);
      }
      await reactionService.reactPost(postId, reactionId, session.accessToken);
    } catch (err) {
      console.error("Failed to select reaction:", err);
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
                postId,
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