"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Edit,
  MessageCircleMore,
  Share2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
} from "lucide-react";
import PriceContentComponent from "@/components/site/event-detail/price-content";
import MapContentComponent from "@/components/site/event-detail/map-content";
import DetailContentComponent from "@/components/site/event-detail/detail-content";
import { AdminOverview } from "@/components/site/event-detail/register-table";
import { DiscussionSection } from "@/components/site/event-detail/discussion-section";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import { PaymentWizardDialog } from "@/components/site/pop-up/new-payment/payment";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ReactionPopover,
  REACTIONS,
  TwemojiImg,
} from "@/components/site/pop-up/comment/reaction";
import { reactionService } from "@/service/post-reaction.service";
import { postService } from "@/service/post.service";
import { useCurrentUser } from "@/context/user-context";
import { Post } from "@/types/posts";
import { ReactionSummary } from "@/components/site/event/ReactionSummary";
import { ReactionItem } from "@/hooks/use-post-reaction";

type PostReactionResponse = {
  success: boolean;
  payload: ReactionItem[];
};

type Tab = "details" | "price" | "map";
type AdminSubTab = "overview" | "discussion";

interface EventDetailClientProps {
  event: Post;
  workspaceId: string;
}

export default function EventDetailClient({
  event: initialEvent,
  workspaceId,
}: EventDetailClientProps) {
  const { currentUser } = useCurrentUser();
  const { data: session, status } = useSession();
  const isAdminOrOrganizer =
    currentUser?.role === "admin" || currentUser?.role === "organizer";

  const [event, setEvent] = useState<Post>(initialEvent);
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminSubTab>("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionPayload, setReactionPayload] = useState<ReactionItem[]>([]);

  const discussionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabTrackRef = useRef<HTMLDivElement>(null);
  const tabPillRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [detailData, setDetailData] = useState({
    id: event?.postId || "det-4401",
    likesCount: 0,
    commentsCount: event?.comments?.length || 0,
    isLikedByUser: false,
  });

  const API_BASE =
    "https://api.dev.hrdevent.app/api/v4/files/preview-file?key=";
  const mediaList =
    event?.media && event.media.length > 0
      ? event.media.map((m) => {
          const path = m.filePath || "";
          return path.startsWith("http") ? path : `${API_BASE}${path}`;
        })
      : ["https://images.unsplash.com/photo-1511578314322-379afb476865"];

  const extendedList = [
    mediaList[mediaList.length - 1],
    ...mediaList,
    mediaList[0],
  ];

  const [currentImgIndex, setCurrentImgIndex] = useState(1);
  const isTransitioning = useRef(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [avatarError, setAvatarError] = useState(false);

  const FALLBACK =
    "https://images.unsplash.com/photo-1511578314322-379afb476865";

  useEffect(() => {
    const btn = tabBtnRefs.current[0];
    if (!btn || !tabPillRef.current) return;
    tabPillRef.current.style.left = `${btn.offsetLeft}px`;
    tabPillRef.current.style.width = `${btn.offsetWidth}px`;
  }, []);

  useEffect(() => {
    const TABS: Tab[] = ["details", "price", "map"];
    const activeIndex = TABS.indexOf(activeTab);
    const btn = tabBtnRefs.current[activeIndex];
    if (!btn || !tabPillRef.current) return;
    tabPillRef.current.style.left = `${btn.offsetLeft}px`;
    tabPillRef.current.style.width = `${btn.offsetWidth}px`;
  }, [activeTab]);

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.accessToken ||
      !initialEvent?.postId
    )
      return;

    const fetchLivePostData = async () => {
      try {
        const livePost = await postService.getById(
          workspaceId,
          initialEvent.postId,
          session.accessToken,
        );
        if (livePost) {
          setEvent(livePost);
          setDetailData((prev) => ({
            ...prev,
            commentsCount: livePost.comments?.length || 0,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch fresh post info:", err);
      }
    };

    fetchLivePostData();
  }, [workspaceId, initialEvent?.postId, session?.accessToken, status]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transition = isTransitioning.current
        ? "transform 500ms ease-in-out"
        : "none";
    }
  }, [currentImgIndex]);

  const goToIndex = (index: number) => {
    isTransitioning.current = true;
    setCurrentImgIndex(index);
  };

  useEffect(() => {
    if (mediaList.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goToIndex(currentImgIndex + 1);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentImgIndex, mediaList.length]);

  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!currentUser?.id || !event?.postId || !session?.accessToken) return;

    const fetchUserReaction = async () => {
      try {
        const data = (await reactionService.getReactionPost(
          event.postId,
          session.accessToken,
        )) as PostReactionResponse;

        const reactions = data?.payload || [];
        const userReaction = reactions.find(
          (r) =>
            r?.reactor?.appUserId === currentUser.id ||
            r?.reactor?.appUserId === currentUser.id,
        );

        if (userReaction) {
          setSelectedReaction(userReaction.type);
          setDetailData((prev) => ({
            ...prev,
            isLikedByUser: true,
            likesCount: reactions.length,
          }));
        } else {
          setSelectedReaction(null);
          setDetailData((prev) => ({
            ...prev,
            isLikedByUser: false,
            likesCount: reactions.length,
          }));
        }

        setReactionPayload(reactions);
      } catch (err) {
        console.error("Failed to fetch post reaction:", err);
      }
    };

    fetchUserReaction();
  }, [currentUser?.id, event?.postId, session?.accessToken, status]);

  const handlePrevImage = () => goToIndex(currentImgIndex - 1);
  const handleNextImage = () => goToIndex(currentImgIndex + 1);

  const handleTransitionEnd = () => {
    if (currentImgIndex === 0) {
      isTransitioning.current = false;
      setCurrentImgIndex(mediaList.length);
    } else if (currentImgIndex === extendedList.length - 1) {
      isTransitioning.current = false;
      setCurrentImgIndex(1);
    }
  };

  const handleScrollToDiscussion = () => {
    if (isAdminOrOrganizer) setActiveAdminTab("discussion");
    setTimeout(() => {
      discussionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);

  const handleLikeToggle = async () => {
    if (!session?.accessToken || !event?.postId) return;

    const isCurrentlyActive = !!selectedReaction;

    setDetailData((prev) => ({
      ...prev,
      isLikedByUser: !isCurrentlyActive,
      likesCount: isCurrentlyActive ? prev.likesCount - 1 : prev.likesCount + 1,
    }));
    setSelectedReaction(isCurrentlyActive ? null : "like");

    setReactionPayload((prev) =>
      isCurrentlyActive
        ? prev.filter((r) => r.reactor.appUserId !== currentUser?.id)
        : [
            ...prev,
            {
              reactionId: "temp",
              type: "like",
              createdAt: "",
              postId: event.postId,
              reactor: {
                appUserId: currentUser?.id ?? "",
              },
            },
          ],
    );

    try {
      if (isCurrentlyActive) {
        await reactionService.removeReactionPost(
          event.postId,
          session.accessToken,
        );
      } else {
        await reactionService.reactPost(
          event.postId,
          "like",
          session.accessToken,
        );
      }
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
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
    if (!session?.accessToken || !event?.postId) return;

    const wasAlreadyActive = !!selectedReaction;
    const previousReaction = selectedReaction;

    setSelectedReaction(reactionId);
    setDetailData((prev) => ({
      ...prev,
      isLikedByUser: true,
      likesCount: wasAlreadyActive ? prev.likesCount : prev.likesCount + 1,
    }));
    setReactionPayload((prev) => {
      const without = prev.filter(
        (r) => r.reactor.appUserId !== currentUser?.id,
      );
      return [
        ...without,
        {
          reactionId: "temp",
          type: reactionId,
          createdAt: "",
          postId: event.postId,
          reactor: {
            appUserId: currentUser?.id ?? "",
          },
        },
      ];
    });

    try {
      if (wasAlreadyActive) {
        await reactionService.removeReactionPost(
          event.postId,
          session.accessToken,
        );
      }
      await reactionService.reactPost(
        event.postId,
        reactionId,
        session.accessToken,
      );
    } catch (err) {
      console.error("Failed to select reaction:", err);
      setSelectedReaction(previousReaction);
      setDetailData((prev) => ({
        ...prev,
        isLikedByUser: wasAlreadyActive,
        likesCount: wasAlreadyActive ? prev.likesCount : prev.likesCount - 1,
      }));
    }
  };

  const formattedCreationDate = event?.createdAt
    ? new Date(event.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <>
      <section className="max-w-full border border-border rounded-lg p-6 flex flex-col gap-y-6 bg-card">
        <section className="flex justify-between items-center gap-x-2 sm:gap-x-4 w-full">
          <Link
            href={`/profile/${event.creator?.userId}`}
            className="min-w-0 flex-1"
          >
            <div className="flex items-center gap-x-2 sm:gap-x-3 min-w-0">
              {event?.creator?.profilePicture && !avatarError ? (
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-secondary shrink-0">
                  <Image
                    unoptimized
                    src={event.creator.profilePicture}
                    alt={event.creator.fullName || "User Avatar"}
                    fill
                    className="object-cover"
                    onError={() => setAvatarError(true)}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-grey-200 border-2 border-secondary flex items-center justify-center font-bold text-primary text-xs sm:text-base uppercase shrink-0">
                  {event?.creator?.fullName?.slice(0, 2) || "EV"}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xs sm:text-sm md:text-subtitle font-medium text-secondary truncate whitespace-nowrap leading-tight">
                  {event?.creator?.fullName ||
                    (isAdminOrOrganizer ? "Workspace Organizer" : "KSGA Team")}
                </p>
                <p className="text-[10px] sm:text-xs md:text-desc-small-semibold font-medium text-muted-foreground whitespace-nowrap mt-0.5">
                  {formattedCreationDate}
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-x-1 sm:gap-x-2 shrink-0">
            {isAdminOrOrganizer && (
              <>
                <span className="bg-primary/10 px-2 py-1 sm:px-4 md:px-6 sm:py-2 md:py-3 rounded-lg sm:rounded-xl text-primary type-desc-small-semibold text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
                  Admin
                </span>
                <Link
                  href={`/event-management/edition/event?groupId=${workspaceId}&postId=${event.postId}`}
                >
                  <span className="flex items-center gap-x-1 border border-border px-2 py-1 sm:px-4 md:px-6 sm:py-2 md:py-3 rounded-lg sm:rounded-xl text-grey-900 type-desc-small-semibold text-[10px] sm:text-xs md:text-sm hover:bg-grey-50 cursor-pointer whitespace-nowrap">
                    <Edit
                      size={12}
                      className="sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px]"
                    />{" "}
                    Edit Event
                  </span>
                </Link>
              </>
            )}
          </div>
        </section>

        <h2 className="type-title text-secondary">
          {event?.title || "Event Detail"}
        </h2>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group aspect-video md:h-87.5 w-full rounded-xl overflow-hidden bg-grey-50 border border-border">
            <div
              ref={trackRef}
              className="flex h-full"
              style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedList.map((src, index) => (
                <div
                  key={index}
                  className="relative min-w-full h-full flex-shrink-0"
                >
                  <Image
                    unoptimized
                    src={imgErrors[src] ? FALLBACK : src}
                    alt={`Slide ${index}`}
                    fill
                    className="object-cover"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [src]: true }))
                    }
                  />
                </div>
              ))}
            </div>

            {mediaList.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer select-none z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer select-none z-10"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-3 py-1 rounded-full">
                  {mediaList.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => goToIndex(index + 1)}
                      className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                        currentImgIndex === index + 1
                          ? "bg-white scale-125"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div
              className="relative flex p-[3px] rounded-xl type-desc-small-semibold"
              style={{ background: "rgba(120,120,128,0.12)" }}
              ref={tabTrackRef}
            >
              <div
                ref={tabPillRef}
                className="absolute top-[3px] h-[calc(100%-6px)] rounded-[9px] z-0 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  background: "#1c4d8d",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
                }}
              />
              {(["details", "price", "map"] as Tab[]).map((t, i) => (
                <button
                  key={t}
                  ref={(el) => {
                    tabBtnRefs.current[i] = el;
                  }}
                  onClick={() => setActiveTab(t)}
                  className={`relative z-10 flex-1 py-2 rounded-[9px] capitalize cursor-pointer transition-colors duration-200 text-sm font-medium border-none bg-transparent ${
                    activeTab === t ? "text-white" : "text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grow pt-4 max-w-full items-stretch min-[1290px]:w-3xl">
              {activeTab === "details" && (
                <DetailContentComponent
                  postId={event?.postId}
                  title={event?.title}
                  content={event?.content}
                  eventStart={event?.eventStart}
                  eventEnd={event?.eventEnd}
                  locationName={event?.location?.locationName}
                />
              )}
              {activeTab === "price" && (
                <PriceContentComponent payment={event?.payment} />
              )}
              {activeTab === "map" && (
                <MapContentComponent
                  locationId={event?.location?.locationId}
                  locationName={event?.location?.locationName}
                  googleMapUrl={event?.location?.googleMapUrl}
                  latitude={event?.location?.latitude}
                  longitude={event?.location?.longitude}
                />
              )}
            </div>

            {!isAdminOrOrganizer && (
              <button
                onClick={() => setIsPaymentOpen(true)}
                className="w-full rounded-md py-2.5 type-desc-semibold text-center text-primary-foreground bg-primary hover:opacity-95 transition-opacity cursor-pointer"
              >
                Register now
              </button>
            )}
          </div>
        </section>

        <section className="flex py-2 justify-between items-center border-b border-border text-grey-400 type-detail">
          <section className="flex items-center justify-between py-2 w-[50%] pr-3">
            <section className="flex gap-x-6 items-center">
              <ReactionPopover
                selectedValue={selectedReaction}
                onReactionSelect={handleReactionSelect}
              >
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-x-1.5 transition-colors cursor-pointer select-none ${
                    activeReaction
                      ? `${activeReaction.color} font-semibold`
                      : "hover:text-primary"
                  }`}
                >
                  {activeReaction ? (
                    <TwemojiImg emoji={activeReaction.emoji} size={20} />
                  ) : (
                    <ThumbsUp size={20} />
                  )}
                  {activeReaction ? activeReaction.displayText : "Like"}
                </button>
              </ReactionPopover>
              <button
                onClick={handleScrollToDiscussion}
                className="flex items-center gap-x-1.5 text-grey-500 font-medium hover:text-primary transition-colors cursor-pointer"
              >
                <MessageCircleMore size={20} className="text-grey-400" />
                {detailData.commentsCount}
              </button>
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-x-1.5 hover:text-primary cursor-pointer"
              >
                <Share2 size={20} /> Share
              </button>
            </section>

            <ReactionSummary payload={reactionPayload} />
          </section>
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
              <AdminOverview event={event} workspaceId={workspaceId} />
            ) : (
              <div ref={discussionRef}>
                <DiscussionSection event={event} workspaceId={workspaceId} />
              </div>
            )}
          </div>
        ) : (
          <div ref={discussionRef} className="space-y-4">
            <DiscussionSection event={event} workspaceId={workspaceId} />
          </div>
        )}
      </section>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        postId={event?.postId}
      />

      <PaymentWizardDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        post={event}
      />
    </>
  );
}
