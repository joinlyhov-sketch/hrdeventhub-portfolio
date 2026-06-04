"use client";
import { Heart, Send } from "lucide-react";
import Image from "next/image";
import { Post } from "@/types/posts";

interface DiscussionSectionProps {
  event: Post;
}

export function DiscussionSection({ event }: DiscussionSectionProps) {
  const defaultUserAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb";
  const processedComments = event?.comments || [];

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-x-2.5">
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center bg-no-repeat border"
          style={{ backgroundImage: `url(${defaultUserAvatar})` }}
        />
        <section className="flex justify-between items-center bg-grey-100 rounded-xl pl-4 pr-1 py-2 w-full">
          <input
            type="text"
            placeholder="Add a comment..."
            className="type-detail bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
          />
          <Send size={28} className="bg-primary rounded-full p-1.5 text-primary-foreground cursor-pointer" />
        </section>
      </section>

      <div className="space-y-6">
        {processedComments.length > 0 ? (
          processedComments.map((comment, idx) => {
            const commentId = comment?.commentId || idx;
            const commentText = comment?.text || comment?.content || "";
            const commentAuthor = comment?.user?.fullName || comment?.user?.name || "KSGA Student";
            const commentAvatar = comment?.user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
            const commentTime = comment?.timestamp || (comment?.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now");
            const commentLikes = comment?.likes ?? 0;

            return (
              <div key={commentId} className="space-y-4 pt-2">
                <div className="flex gap-3 items-start">
                  <Image
                    unoptimized
                    src={commentAvatar}
                    alt=""
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                  <div className="type-detail">
                    <div className="flex items-center gap-2">
                      <span className="type-detail-semibold text-grey-900">{commentAuthor}</span>
                      <span className="text-grey-400 type-detail-small-medium">{commentTime}</span>
                    </div>
                    <p className="text-grey-500 mt-1 type-detail">{commentText}</p>

                    <div className="flex items-center gap-4 text-grey-400 mt-2 type-desc-small-semibold">
                      <button className="hover:text-grey-900">Reply</button>
                      <button className="hover:text-grey-900">Like</button>
                      {commentLikes > 0 && (
                        <span className="text-destructive flex items-center gap-x-1">
                          <Heart size={12} /> {commentLikes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {comment?.replies?.map((reply: any, rIdx: number) => {
                  const replyId = reply?.replyId || rIdx;
                  const replyAuthor = reply?.user?.fullName || reply?.user?.name || "KSGA User";
                  const replyAvatar = reply?.user?.avatarUrl || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61";
                  const replyTime = reply?.timestamp || (reply?.createdAt ? new Date(reply.createdAt).toLocaleDateString() : "Just now");
                  const replyLikes = reply?.likes ?? 0;

                  return (
                    <div key={replyId} className="ml-12 flex gap-3 items-start border-l-2 border-grey-100 pl-4">
                      <Image
                        unoptimized
                        src={replyAvatar}
                        alt=""
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover border"
                      />
                      <div className="type-detail">
                        <div className="flex items-center gap-2">
                          <span className="type-detail-semibold text-grey-900">{replyAuthor}</span>
                          <span className="text-grey-400 type-detail-small-medium">{replyTime}</span>
                        </div>
                        <p className="text-grey-500 mt-1 type-detail">{reply?.text}</p>

                        <div className="flex items-center gap-4 text-grey-400 mt-2 type-desc-small-semibold">
                          <button className="hover:text-grey-900">Reply</button>
                          {replyLikes > 0 && (
                            <span className="text-destructive flex items-center gap-x-1">
                              <Heart size={12} /> {replyLikes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <p className="text-center text-xs text-grey-400 py-4">No comments posted yet. Be the first to start the conversation!</p>
        )}
      </div>
    </div>
  );
}