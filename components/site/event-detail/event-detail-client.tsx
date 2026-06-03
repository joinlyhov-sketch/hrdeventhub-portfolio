"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, ThumbsUp, MessageCircleMore, Share2 } from "lucide-react";
import PriceContentComponent from "../../../components/site/event-detail/price-content";
import MapContentComponent from "../../../components/site/event-detail//map-content";
import DetailContentComponent from "../../../components/site/event-detail//detail-content";
import { AdminOverview } from "../../../components/site/event-detail//register-table";
import { DiscussionSection } from "../../../components/site/event-detail//discussion-section";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import PaymentModal from "@/components/site/pop-up/payment/PaymentModal";
import Link from "next/link";
import { reactionService } from "../../../service/post-reaction.service";
import { useSession, signOut } from "next-auth/react";
import {
  ReactionPopover,
  REACTIONS,
} from "@/components/site/pop-up/comment/reaction";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import type {
  HRDEvent,
  EventDetailState,
  Reaction as ReactionType,
} from "@/data/event-detail";
import { useCurrentUser } from "@/context/user-context";

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

type Tab = "details" | "price" | "map";
type AdminSubTab = "overview" | "discussion";

interface EventDetailClientProps {
  event: HRDEvent;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  console.log("=== EventDetailClient MOUNTED");
  const { currentUser } = useCurrentUser();
  const { data: session, status } = useSession();

  console.log("=== EventDetailClient status:", status);
  console.log(
    "=== EventDetailClient session:",
    JSON.stringify(session, null, 2),
  );

  const isAdminOrOrganizer =
    currentUser?.role === "admin" || currentUser?.role === "organizer";
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminSubTab>("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const openPaymentModal = usePaymentModalStore(
    (state) => state.openPaymentModal,
  );

  const [detailData, setDetailData] = useState<EventDetailState>({
    id: event?.id || "det-4401",
    likesCount: event?.likesCount || 0,
    commentsCount: event?.commentsCount || 0,
    isLikedByUser: false,
  });

  useEffect(() => {
    console.log("Full session object:", session);
  }, [session]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!currentUser?.id || !event?.id || !session?.accessToken) return;

    const fetchUserReaction = async () => {
      try {
        const data = (await reactionService.getReactionPost(
          event.id,
          session.accessToken,
        )) as PostReactionResponse;

        const userReaction = data.payload?.find(
          (r) => r.appUserId === currentUser.id,
        );

        if (userReaction) {
          setSelectedReaction(userReaction.type);
          setDetailData((prev) => ({
            ...prev,
            isLikedByUser: true,
            likesCount: data.payload.length,
          }));
        } else {
          setDetailData((prev) => ({
            ...prev,
            likesCount: data.payload.length,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch post reaction:", err);
      }
    };

    fetchUserReaction();
  }, [currentUser?.id, event?.id, session?.accessToken, status]);

  // EventDetailClient.tsx — add this useEffect
  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      signOut({ callbackUrl: "/login" }); // force re-login
    }
  }, [session?.error]);

  const activeReaction = REACTIONS.find(
    (r: ReactionType) => r.id === selectedReaction,
  );

  // const handleLikeToggle = () => {
  //   setDetailData((prev) => {
  //     const isCurrentlyActive = !!selectedReaction;
  //     if (isCurrentlyActive) {
  //       setSelectedReaction(null);
  //       return {
  //         ...prev,
  //         isLikedByUser: false,
  //         likesCount: prev.likesCount - 1,
  //       };
  //     } else {
  //       setSelectedReaction("like");
  //       return {
  //         ...prev,
  //         isLikedByUser: true,
  //         likesCount: prev.likesCount + 1,
  //       };
  //     }
  //   });
  // };

  // const handleReactionSelect = (reactionId: string) => {
  //   const wasAlreadyActive = !!selectedReaction;
  //   setSelectedReaction(reactionId);
  //   setDetailData((prev) => ({
  //     ...prev,
  //     isLikedByUser: true,
  //     likesCount: wasAlreadyActive ? prev.likesCount : prev.likesCount + 1,
  //   }));
  // };

  const handleLikeToggle = async () => {
    if (!session?.accessToken || !event?.id) return;

    const isCurrentlyActive = !!selectedReaction;

    // Optimistic UI update first
    setDetailData((prev) => ({
      ...prev,
      isLikedByUser: !isCurrentlyActive,
      likesCount: isCurrentlyActive ? prev.likesCount - 1 : prev.likesCount + 1,
    }));
    setSelectedReaction(isCurrentlyActive ? null : "like");

    try {
      if (isCurrentlyActive) {
        await reactionService.removeReactionPost(event.id, session.accessToken);
      } else {
        await reactionService.reactPost(event.id, "like", session.accessToken);
      }
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
      // Revert UI if API call fails
      setDetailData((prev) => ({
        ...prev,
        isLikedByUser: isCurrentlyActive,
        likesCount: isCurrentlyActive
          ? prev.likesCount + 1
          : prev.likesCount - 1,
      }));
      setSelectedReaction(isCurrentlyActive ? "like" : null);
    }
  };

  const handleReactionSelect = async (reactionId: string) => {
    if (!session?.accessToken || !event?.id) return;

    const wasAlreadyActive = !!selectedReaction;

    // Optimistic UI update first
    setSelectedReaction(reactionId);
    setDetailData((prev) => ({
      ...prev,
      isLikedByUser: true,
      likesCount: wasAlreadyActive ? prev.likesCount : prev.likesCount + 1,
    }));

    try {
      if (wasAlreadyActive) {
        // Change reaction type — remove old one first, then add new
        await reactionService.removeReactionPost(event.id, session.accessToken);
      }
      await reactionService.reactPost(
        event.id,
        reactionId,
        session.accessToken,
      );
    } catch (err) {
      console.error("Failed to select reaction:", err);
      // Revert UI if API call fails
      setSelectedReaction(wasAlreadyActive ? selectedReaction : null);
      setDetailData((prev) => ({
        ...prev,
        isLikedByUser: wasAlreadyActive,
        likesCount: wasAlreadyActive ? prev.likesCount : prev.likesCount - 1,
      }));
    }
  };

  return (
    <>
      <section className="max-w-full border border-border rounded-lg p-6 flex flex-col gap-y-6 bg-card">
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${event.creator.avatarUrl})` }}
            />
            <div>
              <p className="type-desc-semibold text-secondary">
                {event.creator.name}
              </p>
              <p className="type-detail-small-medium text-muted-foreground">
                01/05/2026 20:25
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            {isAdminOrOrganizer && (
              <>
                <span className="bg-primary/10 px-6 py-3 rounded-xl text-primary type-desc-small-semibold">
                  Admin
                </span>
                <Link href={`/event-management/edition/event`}>
                  <span className="flex items-center gap-x-1 border border-border px-6 py-3 rounded-xl text-grey-900 type-desc-small-semibold hover:bg-grey-50 cursor-pointer">
                    <Edit size={16} /> Edit Event
                  </span>
                </Link>
              </>
            )}
          </div>
        </section>

        <h2 className="type-title text-grey-900">Calling for HRD Alumni !</h2>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Image
            unoptimized
            src={event.bannerUrl}
            alt="Banner"
            width={600}
            height={350}
            className="rounded-xl object-cover"
          />

          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-3 bg-grey-100 p-1 text-center rounded-xl type-desc-small-semibold">
              {(["details", "price", "map"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`py-2 rounded-md capitalize cursor-pointer ${activeTab === t ? "bg-primary text-primary-foreground" : "text-primary"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grow pt-4 max-w-full items-stretch min-[1290px]:w-3xl">
              {activeTab === "details" && <DetailContentComponent />}
              {activeTab === "price" && <PriceContentComponent />}
              {activeTab === "map" && <MapContentComponent />}
            </div>

            {!isAdminOrOrganizer && (
              <button
                onClick={() => openPaymentModal("register")}
                className="w-full rounded-md py-2.5 type-desc-semibold text-center text-primary-foreground bg-primary hover:opacity-95 transition-opacity cursor-pointer"
              >
                Register now
              </button>
            )}
          </div>
        </section>

        <section className="flex gap-x-6 py-2 border-b border-border text-grey-400 type-detail">
          <ReactionPopover
            selectedValue={selectedReaction}
            onReactionSelect={handleReactionSelect}
          >
            <button
              onClick={handleLikeToggle}
              className={`fleDx items-center gap-x-1 transition-colors cursor-pointer select-none ${
                activeReaction
                  ? `${activeReaction.color} font-semibold`
                  : "hover:text-primary"
              }`}
            >
              <ThumbsUp
                size={16}
                className={
                  activeReaction?.id === "like"
                    ? "fill-primary stroke-primary"
                    : ""
                }
              />{" "}
              <span>
                {activeReaction ? activeReaction.displayText : "Like"}
              </span>
              <span className="text-xs font-normal text-grey-400">
                ({detailData.likesCount})
              </span>
            </button>
          </ReactionPopover>

          <span className="flex items-center gap-x-1">
            <MessageCircleMore size={16} /> {detailData.commentsCount}
          </span>
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-x-1 hover:text-primary cursor-pointer"
          >
            <Share2 size={16} /> Share
          </button>
        </section>

        {isAdminOrOrganizer ? (
          <div className="space-y-6">
            <section className="flex gap-x-6 border-b border-border type-desc-semibold">
              <button
                onClick={() => setActiveAdminTab("overview")}
                className={`pb-2 capitalize cursor-pointer ${activeAdminTab === "overview" ? "text-primary border-b-2 border-primary" : "text-grey-400"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveAdminTab("discussion")}
                className={`pb-2 capitalize cursor-pointer ${activeAdminTab === "discussion" ? "text-primary border-b-2 border-primary" : "text-grey-400"}`}
              >
                Discussion
              </button>
            </section>

            {activeAdminTab === "overview" ? (
              <AdminOverview />
            ) : (
              <DiscussionSection event={event} />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <DiscussionSection event={event} />
          </div>
        )}
      </section>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareUrl={`hrdeventhub.app/events/${detailData.id}`}
      />

      <PaymentModal />
    </>
  );
}
