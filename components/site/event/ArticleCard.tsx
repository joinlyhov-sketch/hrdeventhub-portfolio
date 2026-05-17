"use client";

import { useState } from "react";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  MoreVertical,
} from "lucide-react";

const data = {
  author: {
    name: "Dita Rector",
    avatar: "https://i.pravatar.cc/150?u=dita",
    role: "Organizer",
    date: "01/05/2026 20:25",
  },
  title: "Khmer Food Competition & Sangkran",
  bodyText: "Dear everyone, You can find your photo of the event today here. Thank you.",
  attachmentLink: "https://drive.google.com/drive/folders/1U12M0y6B9uH_cWObkR_zpgm5iopHLYX6",
  likes: 124,
  comments: 18,
};

const mockComments = [
  {
    id: "c1",
    author: {
      name: "Lyhov",
      avatar: "https://i.pravatar.cc/150?u=lyhov",
      initials: "LY"
    },
    date: "2h ago",
    text: "Really excited for this event. Is anyone else joining from 12th gen?",
    replies: [
      {
        id: "r1",
        author: {
          name: "Dine",
          avatar: "https://i.pravatar.cc/150?u=dine"
        },
        date: "1h ago",
        text: "Is there a live stream link? @rectordita",
        isOwn: true
      },
      {
        id: "r2",
        author: {
          name: "Dita Rector",
          avatar: "https://i.pravatar.cc/150?u=dita"
        },
        date: "30min ago",
        text: "@dinety I think there is",
        isOwn: true
      }
    ]
  }
];

export function ArticleCard() {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
            <img src={data.author.avatar} alt={data.author.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="type-desc-semibold text-secondary">{data.author.name}</h3>
            <p className="type-detail-small-medium text-grey-400">{data.author.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#FFF7ED] text-[#F97316] type-desc-small-semibold px-3 py-1 rounded-full uppercase">
            {data.author.role}
          </span>
          <button className="text-grey-400 hover:text-grey-500 cursor-pointer">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-grey-900 mb-4 tracking-tight leading-tight">
        {data.title}
      </h2>
      <p className="type-desc text-grey-500 leading-relaxed mb-4">
        {data.bodyText}
      </p>

      <div className="mb-6">
        <a
          href={data.attachmentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline break-all block leading-normal"
        >
          {data.attachmentLink}
        </a>
      </div>

      <div className="flex items-center gap-6 py-4 border-b border-border type-detail text-grey-500">
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <ThumbsUp size={18} /> {data.likes}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-primary cursor-pointer"
        >
          <MessageSquare size={18} /> {data.comments}
        </button>
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <Share2 size={18} /> Share
        </button>
      </div>

      <div className={`flex items-center gap-3 mt-6 ${showComments ? "mb-8" : ""}`}>
        <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0">
          <img src="https://i.pravatar.cc/150?u=user" alt="Me" className="w-full h-full object-cover" />
        </div>
        <div className="relative grow">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-grey-50 border-none rounded-full py-3 px-6 type-detail focus:ring-1 focus:ring-blue-100 outline-none text-grey-900"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary p-1 cursor-pointer">
            <Send size={18} />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="space-y-6 pt-2">
          {mockComments.map((comment) => (
            <div key={comment.id} className="relative flex flex-col">
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FB] flex items-center justify-center shrink-0 text-[#3FA6DC] font-semibold text-sm">
                  {comment.author.initials}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-bold text-grey-900">{comment.author.name}</span>
                    <span className="text-grey-400 text-xs font-normal">· {comment.date}</span>
                  </div>
                  <p className="text-sm text-grey-900 leading-normal">{comment.text}</p>
                  <div className="flex items-center gap-4 text-xs font-bold text-grey-900 pt-1">
                    <button className="hover:underline cursor-pointer">Reply</button>
                    <button className="hover:underline cursor-pointer">Like</button>
                  </div>
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="relative pl-10 mt-4 space-y-5">
                  <div 
                    className="absolute left-[20px] top-[-24px] w-[20px] border-l border-b border-grey-200 rounded-bl-[12px]" 
                    style={{ bottom: "24px" }}
                  />
                  
                  {comment.replies.map((reply, index) => (
                    <div key={reply.id} className="relative flex items-start gap-3">
                      {index > 0 && (
                        <div className="absolute left-[-20px] top-[-24px] bottom-[24px] border-l border-grey-200" />
                      )}
                      <div className="absolute left-[-20px] top-5 w-[20px] border-t border-grey-200" />
                      
                      <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0 relative z-10">
                        <img src={reply.author.avatar} alt={reply.author.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-bold text-grey-900">{reply.author.name}</span>
                          <span className="text-grey-400 text-xs font-normal">· {reply.date}</span>
                        </div>
                        <p className="text-sm text-grey-900 leading-normal">
                          {reply.text.split(" ").map((word, i) => 
                            word.startsWith("@") ? (
                              <span key={i} className="text-blue-600 font-medium">{word} </span>
                            ) : (
                              word + " "
                            )
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-grey-900 pt-1">
                          <button className="hover:underline cursor-pointer">Reply</button>
                          {reply.isOwn && (
                            <>
                              <button className="hover:underline cursor-pointer">Edit</button>
                              <button className="hover:underline cursor-pointer">Delete</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}