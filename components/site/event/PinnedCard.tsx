"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/posts";
import { getMediaUrl } from "@/libs/media";
import staticImage from "../../../public/images/PinnedCardTest.jpg";

interface PinnedCardProps {
  post: Post;
  groupid: string;
}

export function PinnedCard({ post, groupid }: PinnedCardProps) {
  const coverImage = post.media?.find((m) => m.isCover) ?? post.media?.[0];
  const imageUrl = getMediaUrl(coverImage?.filePath);

  const badge = (post.category ?? "event").toUpperCase();
  const schedule = [post.eventStart, post.eventEnd].filter(Boolean).join(" — ");

  return (
    <article className="relative w-full overflow-hidden rounded-xl bg-secondary border border-border text-white shadow-sm group min-h-[180px] sm:min-h-[240px] flex items-end p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        ) : (
          <Image
            src={staticImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-primary/0" />
      </div>

      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-2 sm:gap-4 md:gap-6">
        <div className="flex flex-col items-start gap-1.5 sm:gap-3">
          <span className="inline-flex bg-subtle text-secondary type-desc-small-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md tracking-wide text-[10px] sm:text-xs">
            {badge}
          </span>
          <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white">
            {post.title}
          </h2>
          {schedule && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/90 text-[10px] sm:text-xs md:text-sm">
              <Clock size={16} strokeWidth={2.5} className="text-white/80" />
              <time>{schedule}</time>
            </div>
          )}
        </div>

        <div className="w-full md:w-auto shrink-0">
          <Link href={`/group/${groupid}/event/${post.postId}`} className="w-full">
            <button type="button" className="w-full md:w-auto bg-white text-secondary hover:bg-grey-100 active:scale-[0.99] hover:cursor-pointer transition-all px-4 sm:px-7 py-2 sm:py-3.5 rounded-xl type-detail-semibold shadow-md whitespace-nowrap text-xs sm:text-sm">
              View Detail
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}
