"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Edit,
  MessageCircleMore,
  Share2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  CalendarMinus2,
  MapPin,
  Users,
  Check,
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
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const discussionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabTrackRef = useRef<HTMLDivElement>(null);
  const tabPillRef = useRef<HTMLDivElement>(null);
  const tabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTabPillRef = useRef<HTMLDivElement>(null);
  const mobileTabBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileDiscussionRef = useRef<HTMLDivElement>(null);

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
    const positionInstantly = (
      pill: HTMLDivElement | null,
      btn: HTMLButtonElement | null,
    ) => {
      if (!pill || !btn) return;
      pill.style.transition = "none";
      pill.style.left = `${btn.offsetLeft}px`;
      pill.style.width = `${btn.offsetWidth}px`;
      requestAnimationFrame(() => {
        pill.style.transition = "";
      });
    };
    requestAnimationFrame(() => {
      positionInstantly(tabPillRef.current, tabBtnRefs.current[0]);
      positionInstantly(mobileTabPillRef.current, mobileTabBtnRefs.current[0]);
    });
  }, []);

  useEffect(() => {
    const TABS: Tab[] = ["details", "price", "map"];
    const activeIndex = TABS.indexOf(activeTab);
    const btn = tabBtnRefs.current[activeIndex];
    if (btn && tabPillRef.current) {
      tabPillRef.current.style.left = `${btn.offsetLeft}px`;
      tabPillRef.current.style.width = `${btn.offsetWidth}px`;
    }
    const mobileBtn = mobileTabBtnRefs.current[activeIndex];
    if (mobileBtn && mobileTabPillRef.current) {
      mobileTabPillRef.current.style.left = `${mobileBtn.offsetLeft}px`;
      mobileTabPillRef.current.style.width = `${mobileBtn.offsetWidth}px`;
    }
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
      const isMobileView = window.innerWidth < 768;
      const target = isMobileView
        ? mobileDiscussionRef.current
        : discussionRef.current;
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);

  const handleCommentsCountChange = useCallback((count: number) => {
    setDetailData((prev) =>
      prev.commentsCount === count ? prev : { ...prev, commentsCount: count },
    );
  }, []);

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

  const [isRegistered, setIsRegistered] = useState(false);

  interface MobileParticipant {
    user: {
      appUserId: string;
      username: string;
      firstName?: string;
      lastName?: string;
      profilePicture?: string;
    };
  }
  const [participants, setParticipants] = useState<MobileParticipant[]>([]);

  const refreshParticipants = useCallback(async () => {
    if (!event?.postId || !session?.accessToken || !currentUser?.id) return;
    try {
      const data = (await postService.getParticipants(
        event.postId,
        session.accessToken,
        1,
        100,
      )) as { payload?: MobileParticipant[] };
      const list = data.payload ?? [];
      setParticipants(list);
      setIsRegistered(list.some((p) => p.user?.appUserId === currentUser.id));
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    }
  }, [event?.postId, session?.accessToken, currentUser]);

  useEffect(() => {
    refreshParticipants();
  }, [refreshParticipants]);

  const rawDescription = event?.content || "No event description provided.";
  const DESCRIPTION_LIMIT = 150;
  const isLongDescription = rawDescription.length > DESCRIPTION_LIMIT;

  const mobileParts = event?.eventStart
    ? event.eventStart.split(",").map((s) => s.trim())
    : [];
  const mobileDateSegment =
    mobileParts.length >= 3
      ? `${mobileParts[1]}, ${mobileParts[2]}`
      : (mobileParts[0] ?? "Date Pending");
  const mobileTimeSegment =
    mobileParts.length >= 4 ? mobileParts[mobileParts.length - 1] : "";

  const mobileParticipantAvatars = (size: "sm" | "md") =>
    participants.slice(0, 3).map(({ user }) => {
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username;
      const dim = size === "md" ? "h-7 w-7" : "h-6 w-6";
      const imgSize = size === "md" ? "28px" : "24px";
      const textSize = size === "md" ? "text-[9px]" : "text-[8px]";
      return (
        <Link
          key={user.appUserId}
          href={`/profile/${user.appUserId}`}
          className={`relative ${dim} rounded-full ring-2 ring-card overflow-hidden bg-grey-200 flex items-center justify-center shrink-0`}
        >
          {user.profilePicture ? (
            <Image
              unoptimized
              src={user.profilePicture}
              alt={name}
              fill
              sizes={imgSize}
              className="object-cover"
            />
          ) : (
            <span className={`${textSize} font-semibold text-grey-600`}>
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
      );
    });

  const mobileDetailsContent = (
    <>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <CalendarMinus2 size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-secondary">
            {mobileDateSegment}
          </p>
          <p className="text-xs text-grey-500">{mobileTimeSegment}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-secondary">
            {event?.location?.locationName || "Location TBD"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-grey-50/50 rounded-xl border border-border/60">
        <Link href={`/profile/${event.creator?.userId}`} className="shrink-0">
          {event?.creator?.profilePicture && !avatarError ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-secondary">
              <Image
                unoptimized
                src={event.creator.profilePicture}
                alt={event.creator.fullName || "Organizer"}
                fill
                className="object-cover"
                onError={() => setAvatarError(true)}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-grey-200 border-2 border-secondary flex items-center justify-center font-bold text-primary text-sm uppercase">
              {event?.creator?.fullName?.slice(0, 2) || "EV"}
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-secondary truncate">
            {event?.creator?.fullName || "Organizer"}
          </p>
          <p className="text-xs text-grey-500">Organizer</p>
        </div>
        <Link href={`/profile/${event.creator?.userId}`}>
          <span className="text-xs border border-border px-3 py-1.5 rounded-xl text-grey-700 hover:bg-grey-100 transition-colors cursor-pointer">
            View
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 pt-1">
        <h2 className="text-base font-bold text-secondary">About Event</h2>
        <p className="text-sm text-grey-500 leading-relaxed">
          {isLongDescription && !isDescExpanded
            ? rawDescription.slice(0, DESCRIPTION_LIMIT)
            : rawDescription}
          {isLongDescription && !isDescExpanded && <span>... </span>}
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setIsDescExpanded((v) => !v)}
              className="text-primary font-semibold text-sm"
            >
              {isDescExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </p>
      </div>
    </>
  );

  const mobileTabBar = (
    <div
      className="relative flex p-0.75 border-2 border-border rounded-xl"
      style={{ background: "rgba(120,120,128,0.12)" }}
    >
      <div
        ref={mobileTabPillRef}
        className="absolute top-0.75 h-[calc(100%-6px)] rounded-[9px] z-0 transition-all duration-250 ease-in-out"
        style={{
          background: "#1c4d8d",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
        }}
      />
      {(["details", "price", "map"] as Tab[]).map((t, i) => (
        <button
          key={t}
          ref={(el) => {
            mobileTabBtnRefs.current[i] = el;
          }}
          type="button"
          onClick={() => setActiveTab(t)}
          className={`relative z-10 flex-1 py-2.5 rounded-[9px] capitalize cursor-pointer transition-colors duration-200 text-sm font-medium border-none bg-transparent ${
            activeTab === t ? "text-white" : "text-gray-500"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );

  const mobileTabContent = (
    <div className="flex flex-col gap-5 min-h-55">
      {activeTab === "details" &&
        (isAdminOrOrganizer ? (
          <DetailContentComponent
            postId={event?.postId}
            title={event?.title}
            content={event?.content}
            eventStart={event?.eventStart}
            eventEnd={event?.eventEnd}
            locationName={event?.location?.locationName}
            hideTitle
          />
        ) : (
          mobileDetailsContent
        ))}
      {activeTab === "price" && (
        <div className="flex flex-col items-center justify-center h-55">
          <PriceContentComponent payment={event?.payment} />
        </div>
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
  );

  const mobileReactionBar = (
    <div className="flex items-center justify-between py-2 border-t border-border text-grey-400 text-sm">
      <div className="flex items-center gap-6">
        <ReactionPopover
          selectedValue={selectedReaction}
          onReactionSelect={handleReactionSelect}
        >
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`flex items-center gap-x-1.5 transition-colors cursor-pointer select-none ${
              activeReaction
                ? `${activeReaction.color} font-semibold`
                : "hover:text-primary"
            }`}
          >
            {activeReaction ? (
              <TwemojiImg emoji={activeReaction.emoji} size={18} />
            ) : (
              <ThumbsUp size={18} />
            )}
            <span>{activeReaction ? activeReaction.displayText : "Like"}</span>
          </button>
        </ReactionPopover>
        <button
          type="button"
          onClick={handleScrollToDiscussion}
          className="flex items-center gap-x-1.5 text-grey-500 font-medium hover:text-primary transition-colors cursor-pointer"
        >
          <MessageCircleMore size={18} className="text-grey-400" />
          <span>{detailData.commentsCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-x-1.5 hover:text-primary cursor-pointer"
        >
          <Share2 size={18} /> Share
        </button>
      </div>
      <ReactionSummary payload={reactionPayload} />
    </div>
  );

  const mobileCoverImage = (
    <div className="relative w-full aspect-video overflow-hidden">
      <Image
        unoptimized
        src={imgErrors[mediaList[0]] ? FALLBACK : mediaList[0]}
        alt="Event cover"
        fill
        className="object-cover"
        onError={() =>
          setImgErrors((prev) => ({ ...prev, [mediaList[0]]: true }))
        }
      />
      {mediaList.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {mediaList.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${idx === 0 ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const mobileParticipantBar = (
    <div className="mx-4 -mt-5 relative z-10 bg-card rounded-2xl shadow-md px-4 py-3 flex items-center justify-between border border-border">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">{mobileParticipantAvatars("md")}</div>
        <span className="text-sm font-semibold text-primary">
          {participants.length === 0
            ? "No participants yet"
            : `+${participants.length} Going`}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsShareOpen(true)}
        className="bg-primary text-white text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-primary/85 transition-colors cursor-pointer"
      >
        Share
      </button>
    </div>
  );

  return (
    <>
      {!isAdminOrOrganizer && (
        <div className="md:hidden flex flex-col bg-card border border-border rounded-lg overflow-hidden">
          {mobileCoverImage}
          {mobileParticipantBar}
          <div className="flex flex-col gap-5 px-4 pt-5 pb-6">
            <h1 className="text-xl font-bold text-secondary">
              {event?.title || "Event"}
            </h1>
            <button
              type="button"
              onClick={() => !isRegistered && setIsPaymentOpen(true)}
              disabled={isRegistered}
              className={`w-full rounded-xl py-2.5 font-semibold text-sm text-center transition-all cursor-pointer ${
                isRegistered
                  ? "bg-green-400/15 text-accent cursor-default"
                  : "bg-primary text-white hover:bg-primary/85 hover:shadow-lg active:scale-[0.98]"
              }`}
            >
              {isRegistered ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> You are registered!
                </span>
              ) : (
                "Register now"
              )}
            </button>
            {mobileTabBar}
            {mobileTabContent}
            {mobileReactionBar}
            <div ref={mobileDiscussionRef}>
              <DiscussionSection
                event={event}
                workspaceId={workspaceId}
                onCommentsCountChange={handleCommentsCountChange}
              />
            </div>
          </div>
        </div>
      )}
      <section
        className={`max-w-full border border-border rounded-lg p-6 flex flex-col gap-y-4 sm:gap-y-6 bg-card${!isAdminOrOrganizer ? " hidden md:flex" : ""}`}
      >
        <section className="flex justify-between items-center gap-x-3 w-full">
          <Link
            href={`/profile/${event.creator?.userId}`}
            className="min-w-0 flex-1"
          >
            <div className="flex items-center gap-x-3 min-w-0">
              {event?.creator?.profilePicture && !avatarError ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-secondary shrink-0">
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
                <div className="w-9 h-9 rounded-full bg-grey-200 border-2 border-secondary flex items-center justify-center font-bold text-primary text-xs uppercase shrink-0">
                  {event?.creator?.fullName?.slice(0, 2) || "EV"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-secondary truncate leading-tight">
                  {event?.creator?.fullName ||
                    (isAdminOrOrganizer ? "Workspace Organizer" : "KSGA Team")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formattedCreationDate}
                </p>
              </div>
            </div>
          </Link>
          {isAdminOrOrganizer && (
            <div className="flex flex-col gap-y-1.5 shrink-0 sm:flex-row sm:items-center sm:gap-x-2">
              <span className="block bg-primary/10 px-3 py-1.5 rounded-xl text-primary text-xs font-semibold capitalize text-center whitespace-nowrap">
                {event.creator?.role
                  ? event.creator.role.charAt(0).toUpperCase() +
                    event.creator.role.slice(1).toLowerCase()
                  : currentUser?.role === "admin"
                    ? "Admin"
                    : "Organizer"}
              </span>
              <Link
                href={`/event-management/edition/event?groupId=${workspaceId}&postId=${event.postId}`}
                className="block"
              >
                <span className="flex items-center justify-center gap-x-1.5 border border-border px-3 py-1.5 rounded-xl text-grey-700 text-xs font-medium hover:bg-grey-50 transition-colors cursor-pointer whitespace-nowrap">
                  <Edit size={13} />
                  Edit Event
                </span>
              </Link>
            </div>
          )}
        </section>

        <h2 className="text-xl font-bold leading-snug md-type-title text-secondary">
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
                  className="relative min-w-full h-full shrink-0"
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
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer select-none z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
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
              className="relative flex p-0.75 border-2 border-border rounded-xl type-desc-small-semibold"
              style={{ background: "rgba(120,120,128,0.12)" }}
              ref={tabTrackRef}
            >
              <div
                ref={tabPillRef}
                className="absolute top-0.75 h-[calc(100%-6px)] rounded-[9px] z-0 transition-all duration-250 ease-in-out"
                style={{
                  background: "#1c4d8d",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
                }}
              />
              {(["details", "price", "map"] as Tab[]).map((t, i) => (
                <button
                  key={t}
                  type="button"
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

            <div className="grow pt-2 max-w-full items-stretch min-[1290px]:w-3xl">
              {activeTab === "details" && (
                <DetailContentComponent
                  postId={event?.postId}
                  title={event?.title}
                  content={event?.content}
                  eventStart={event?.eventStart}
                  eventEnd={event?.eventEnd}
                  locationName={event?.location?.locationName}
                  hideTitle
                />
              )}
              {activeTab === "price" && (
                <div className="flex flex-col items-center justify-center h-55">
                  <PriceContentComponent payment={event?.payment} />
                </div>
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
                type="button"
                onClick={() => !isRegistered && setIsPaymentOpen(true)}
                disabled={isRegistered}
                className={`w-full rounded-md py-2.5 text-desc-medium text-center transition-opacity cursor-pointer ${
                  isRegistered
                    ? "bg-green-400/15 text-accent cursor-default font-regular"
                    : "text-primary-foreground bg-primary hover:opacity-95"
                }`}
              >
                {isRegistered ? "✓ You are registered!" : "Register now"}
              </button>
            )}
          </div>
        </section>

        <section className="flex items-center justify-between py-3 border-b border-border text-grey-400 text-sm">
          <div className="flex items-center gap-x-6">
            <ReactionPopover
              selectedValue={selectedReaction}
              onReactionSelect={handleReactionSelect}
            >
              <button
                type="button"
                onClick={handleLikeToggle}
                className={`flex items-center gap-x-1.5 transition-colors cursor-pointer select-none ${
                  activeReaction
                    ? `${activeReaction.color} font-semibold`
                    : "hover:text-primary"
                }`}
              >
                {activeReaction ? (
                  <TwemojiImg emoji={activeReaction.emoji} size={18} />
                ) : (
                  <ThumbsUp size={18} />
                )}
                <span>
                  {activeReaction ? activeReaction.displayText : "Like"}
                </span>
              </button>
            </ReactionPopover>
            <button
              type="button"
              onClick={handleScrollToDiscussion}
              className="flex items-center gap-x-1.5 text-grey-500 font-medium hover:text-primary transition-colors cursor-pointer"
            >
              <MessageCircleMore size={18} className="text-grey-400" />
              <span>{detailData.commentsCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-x-1.5 hover:text-primary cursor-pointer"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
          <ReactionSummary payload={reactionPayload} />
        </section>

        {isAdminOrOrganizer ? (
          <div className="space-y-6">
            <section className="flex gap-x-6 border-b border-border type-desc-semibold">
              <button
                type="button"
                onClick={() => setActiveAdminTab("overview")}
                className={`pb-2 capitalize cursor-pointer ${activeAdminTab === "overview" ? "text-primary border-b-2 border-primary" : "text-grey-400"}`}
              >
                Overview
              </button>
              <button
                type="button"
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
                <DiscussionSection
                  event={event}
                  workspaceId={workspaceId}
                  onCommentsCountChange={handleCommentsCountChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div ref={discussionRef} className="space-y-4">
            <DiscussionSection
              event={event}
              workspaceId={workspaceId}
              onCommentsCountChange={handleCommentsCountChange}
            />
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
        onSuccess={() => {
          setIsRegistered(true);
          refreshParticipants();
        }}
        post={event}
      />
    </>
  );
}
