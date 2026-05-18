"use client";
import {
  CalendarMinus2,
  ChevronRight,
  Clock,
  FolderClosed,
  Heart,
  MapPin,
  MessageCircleMore,
  Send,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { MOCK_EVENTS, CURRENT_USER } from "../../../../data/event-detail";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Sen } from "next/font/google";
import { useState } from "react";
import PriceContentCOmponent from "../../../../components/site/event-detail/price-content";
import MapContentComponent from "../../../../components/site/event-detail/map-content";
import DetailContentComponent from "../../../../components/site/event-detail/detail-content";

type Tab = "details" | "price" | "map";
const tabs: { id: Tab; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "price", label: "Price" },
  { id: "map", label: "Map" },
];

const event = MOCK_EVENTS[0];

export default function EventDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  return (
    <>
      <section className="w-full flex flex-col">
        <section className="flex items-center gap-3 mb-6 border-b sticky top-0 z-50 py-2">
          <div className="bg-primary p-2 rounded-md text-white">
            <FolderClosed />
          </div>
          <div>
            <span className="text-desc-small-semibold text-primary bg-muted px-2 py-0.5 rounded">
              Internal
            </span>
            <h1 className="type-subtitle text-primary">
              14th Generation Group
            </h1>
          </div>
        </section>

        <section className="flex gap-x-1 items-center">
          <Link href="/event" className="text-desc text-primary">
            Events
          </Link>
          <span>
            <ChevronRight size={16} className="text-primary text-sm" />
          </span>
          <Link
            href="/id"
            className="text-desc-semibold font-medium text-action"
          >
            {event.id}
          </Link>
        </section>

        <section className="border border-primary/20 rounded-lg p-6 flex flex-col gap-y-4">
          <section className="flex justify-between items-center">
            <section className="flex items-center gap-x-4">
              <div
                className="w-11 h-11 rounded-full bg-cover bg-center bg-no-repeat border-2 border-primary"
                style={{ backgroundImage: `url(${event.creator.avatarUrl})` }}
                aria-label="creator image"
              />
              <section className="flex flex-col">
                <p className="text-subtitle font-semibold text-primary">
                  {event.creator.name}
                </p>
                <p className="text-detail-small-medium text-grey-500 font-semibold">
                  {event.date} &nbsp;{event.time}
                </p>
              </section>
            </section>
            <section className="bg-primary/10 px-4 py-2 w-fit rounded-lg">
              <p className="text-detail-medium font-medium text-primary">
                {event.creator.role}
              </p>
            </section>
          </section>

          <section>
            <p className="text-title  font-semibold text-accent-foreground">
              {event.postTitle}
            </p>
          </section>

          <section className="flex items-start justify-between gap-x-6">
            <section className="w-full">
              <Image
                unoptimized
                src={event.bannerUrl}
                alt="Banner Image"
                width={600}
                height={0}
                className="rounded-xl"
              />
            </section>

            <section className="w-full h-full flex flex-col justify-between">
              <section className="grid grid-cols-3 bg-grey-200 border border-grey-300 p-1 text-center rounded-2xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-6 rounded-lg text-desc-semibold font-semibold transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-primary hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </section>

              <div>
                {activeTab === "details" && <DetailContentComponent />}
                {activeTab === "price" && <PriceContentCOmponent />}
                {activeTab === "map" && <MapContentComponent />}
              </div>

              <button className="w-full  rounded-xl py-2.5 text-desc text-center text-white bg-primary hover:bg-primary-hover">
                Register Now
              </button>
            </section>
          </section>

          <hr />

          <section className="flex items-center gap-x-6">
            <section className="flex items-center gap-x-1.5 text-detail text-grey-500">
              <ThumbsUp size={18} />
              <p>{event.likesCount}</p>
            </section>

            <section className="flex items-center gap-x-1.5 text-detail text-grey-500">
              <MessageCircleMore size={18} />
              <p>{event.commentsCount}</p>
            </section>

            <section className="flex items-center gap-x-1.5 text-detail text-grey-500">
              <Share2 size={18} />
              <p>{event.shareCount}</p>
            </section>
          </section>

          <section className="flex items-center gap-x-2.5">
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${event.currentUserAvatarUrl})` }}
              aria-label="creator image"
            />
            <section className="flex  justify-between items-center bg-grey-100 rounded-xl pl-4 pr-1 py-2.5 w-full">
              <input
                type="text"
                placeholder="Add a comment..."
                className="text-detail"
              />
              <Send
                size={32}
                className="bg-primary rounded-full p-2 text-white"
              />
            </section>
          </section>

          <section>
            <p className="text-desc-semibold font-semibold">Discussion</p>
          </section>

          <div className="space-y-6">
            {event.comments.map((comment) => (
              <div key={comment.id} className="space-y-4 pt-2">
                <div className="flex gap-3 items-start">
                  <Image
                    unoptimized
                    src={comment.user.avatarUrl}
                    alt=""
                    width={9}
                    height={9}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{comment.text}</p>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-2">
                      <button className="hover:text-slate-700">Reply</button>
                      <button className="hover:text-slate-700">Like</button>
                      {comment.likes > 0 && (
                        <span className="text-rose-500 font-medium flex items-center gap-x-1">
                          <Heart size={14} /> {comment.likes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="ml-12 flex gap-3 items-start border-l-2 border-slate-100 pl-4"
                  >
                    <Image
                      unoptimized
                      src={reply.user.avatarUrl}
                      alt=""
                      width={7}
                      height={7}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {reply.user.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {reply.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{reply.text}</p>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-2">
                        <button className="hover:text-slate-700">Reply</button>
                        {(CURRENT_USER.role === "Admin" ||
                          CURRENT_USER.id === reply.user.id) && (
                          <button className="text-red-400 hover:text-red-600">
                            Delete
                          </button>
                        )}
                        {reply.likes > 0 && (
                          <span className="text-rose-500 font-medium flex items-center gap-x-1">
                            <Heart size={14} /> {reply.likes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}