"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, ThumbsUp, MessageCircleMore, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import PriceContentComponent from "../../../components/site/event-detail/price-content";
import MapContentComponent from "../../../components/site/event-detail/map-content";
import DetailContentComponent from "../../../components/site/event-detail/detail-content";
import { AdminOverview } from "../../../components/site/event-detail/register-table";
import { DiscussionSection } from "../../../components/site/event-detail/discussion-section";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import PaymentModal from "@/components/site/pop-up/payment/PaymentModal";
import Link from "next/link";
import { ReactionPopover, REACTIONS } from "@/components/site/pop-up/comment/reaction";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import { useCurrentUser } from "@/context/user-context";
import { Post } from "@/types/posts";

type Tab = "details" | "price" | "map";
type AdminSubTab = "overview" | "discussion";

interface EventDetailClientProps {
  event: Post;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const { currentUser } = useCurrentUser();
  const isAdminOrOrganizer =
    currentUser?.role === "admin" || currentUser?.role === "organizer";

  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [activeAdminTab, setActiveAdminTab] = useState<AdminSubTab>("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const openPaymentModal = usePaymentModalStore((state) => state.openPaymentModal);

  const [detailData, setDetailData] = useState({
    id: event?.postId || "det-4401",
    likesCount: 124,
    commentsCount: event?.comments?.length || 0,
    isLikedByUser: false,
  });

  const mediaList = event?.media && event.media.length > 0
    ? event.media.map((m: any) => m.filePath || m.url)
    : ["https://images.unsplash.com/photo-1511578314322-379afb476865"];

  const handlePrevImage = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImgIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  const activeReaction = REACTIONS.find((r: any) => r.id === selectedReaction);

  const handleLikeToggle = () => {
    setDetailData((prev) => {
      const isCurrentlyActive = !!selectedReaction;
      if (isCurrentlyActive) {
        setSelectedReaction(null);
        return { ...prev, isLikedByUser: false, likesCount: prev.likesCount - 1 };
      } else {
        setSelectedReaction("like");
        return { ...prev, isLikedByUser: true, likesCount: prev.likesCount + 1 };
      }
    });
  };

  const handleReactionSelect = (reactionId: string) => {
    const wasAlreadyActive = !!selectedReaction;
    setSelectedReaction(reactionId);
    setDetailData((prev) => ({
      ...prev,
      isLikedByUser: true,
      likesCount: wasAlreadyActive ? prev.likesCount : prev.likesCount + 1,
    }));
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
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-full bg-grey-200 border border-border flex items-center justify-center font-bold text-primary uppercase">
              {event?.title?.slice(0, 2) || "EV"}
            </div>
            <div>
              <p className="type-desc-semibold text-secondary">
                {isAdminOrOrganizer ? "Workspace Organizer" : "KSGA Team"}
              </p>
              <p className="type-detail-small-medium text-muted-foreground">
                {formattedCreationDate}
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

        <h2 className="type-title text-grey-900">{event?.title || "Event Detail"}</h2>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group aspect-video md:h-[350px] w-full rounded-xl overflow-hidden bg-grey-50 border border-border">
            <Image
              unoptimized
              src={mediaList[currentImgIndex]}
              alt={`Banner slider image view ${currentImgIndex + 1}`}
              fill
              className="object-cover transition-all duration-300"
            />
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
                      className={`h-2 w-2 rounded-full transition-all ${index === currentImgIndex ? "bg-white scale-125" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

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
              {activeTab === "details" && (
                <DetailContentComponent
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
                onClick={() => openPaymentModal("register")}
                className="w-full rounded-md py-2.5 type-desc-semibold text-center text-primary-foreground bg-primary hover:opacity-95 transition-opacity cursor-pointer"
              >
                Register now
              </button>
            )}
          </div>
        </section>

        <section className="flex gap-x-6 py-2 border-b border-border text-grey-400 type-detail">
          <ReactionPopover selectedValue={selectedReaction} onReactionSelect={handleReactionSelect}>
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-x-1 transition-colors cursor-pointer select-none ${activeReaction ? `${activeReaction.color} font-semibold` : "hover:text-primary"}`}
            >
              <ThumbsUp size={16} className={activeReaction?.id === "like" ? "fill-primary stroke-primary" : ""} />
              <span>{activeReaction ? activeReaction.displayText : "Like"}</span>
              <span className="text-xs font-normal text-grey-400">({detailData.likesCount})</span>
            </button>
          </ReactionPopover>

          <span className="flex items-center gap-x-1">
            <MessageCircleMore size={16} /> {detailData.commentsCount}
          </span>
          <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-x-1 hover:text-primary cursor-pointer">
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
            {activeAdminTab === "overview" ? <AdminOverview /> : <DiscussionSection event={event} />}
          </div>
        ) : (
          <div className="space-y-4">
            <DiscussionSection event={event} />
          </div>
        )}
      </section>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} shareUrl={`hrdeventhub.app/events/${detailData.id}`} />
      <PaymentModal />
    </>
  );
}