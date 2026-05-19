"use client";
import { Heart, Send } from "lucide-react";
import Image from "next/image";

interface DiscussionSection {
  event: {
    currentUserAvatarUrl: string;
    comments: Array<{
      id: string | number;
      user: { name: string; avatarUrl: string };
      timestamp: string;
      text: string;
      likes: number;
      replies: Array<{
        id: string | number;
        user: { id: string | number; name: string; avatarUrl: string };
        timestamp: string;
        text: string;
        likes: number;
      }>;
    }>;
  };
}

export function DiscussionSection({ event }: DiscussionSection) {
  return (
    <div className="space-y-6">
      <section className="flex items-center gap-x-2.5">
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${event.currentUserAvatarUrl})` }}
        />
        <section className="flex justify-between items-center bg-grey-100 rounded-xl pl-4 pr-1 py-2 w-full">
          <input
            type="text"
            placeholder="Add a comment..."
            className="type-detail bg-transparent优化 outline-none w-full text-foreground placeholder:text-muted-foreground"
          />
          <Send size={28} className="bg-primary rounded-full p-1.5 text-primary-foreground cursor-pointer" />
        </section>
      </section>
      <div className="space-y-6">
        {event.comments.map((comment) => (
          <div key={comment.id} className="space-y-4 pt-2">
            <div className="flex gap-3 items-start">
              <Image
                unoptimized
                src={comment.user.avatarUrl}
                alt=""
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="type-detail">
                <div className="flex items-center gap-2">
                  <span className="type-detail-semibold text-grey-900">{comment.user.name}</span>
                  <span className="text-grey-400 type-detail-small-medium">{comment.timestamp}</span>
                </div>
                <p className="text-grey-500 mt-1 type-detail">{comment.text}</p>

                <div className="flex items-center gap-4 text-grey-400 mt-2 type-desc-small-semibold">
                  <button className="hover:text-grey-900">Reply</button>
                  <button className="hover:text-grey-900">Like</button>
                  {comment.likes > 0 && (
                    <span className="text-destructive flex items-center gap-x-1">
                      <Heart size={12} /> {comment.likes}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {comment.replies?.map((reply) => (
              <div key={reply.id} className="ml-12 flex gap-3 items-start border-l-2 border-grey-100 pl-4">
                <Image
                  unoptimized
                  src={reply.user.avatarUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="type-detail">
                  <div className="flex items-center gap-2">
                    <span className="type-detail-semibold text-grey-900">{reply.user.name}</span>
                    <span className="text-grey-400 type-detail-small-medium">{reply.timestamp}</span>
                  </div>
                  <p className="text-grey-500 mt-1 type-detail">{reply.text}</p>

                  <div className="flex items-center gap-4 text-grey-400 mt-2 type-desc-small-semibold">
                    <button className="hover:text-grey-900">Reply</button>
                    {reply.likes > 0 && (
                      <span className="text-destructive flex items-center gap-x-1">
                        <Heart size={12} /> {reply.likes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}