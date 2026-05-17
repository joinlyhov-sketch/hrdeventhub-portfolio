import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  MoreVertical,
  Megaphone,
} from "lucide-react";

interface Author {
  name: string;
  avatar: string;
  role: "Admin" | "Organizer" | "Student" | string;
  date: string;
}

interface ArticleCardProps {
  author: Author;
  title: string;
  bodyText: string;
  attachmentLink: string;
  likes: number;
  comments: number;
}

export function ArticleCard({
  author,
  title,
  bodyText,
  attachmentLink,
  likes,
  comments,
}: ArticleCardProps) {
  return (
    <div className="bg-background rounded-[12px] border border-border p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="type-desc-semibold text-secondary">{author.name}</h3>
            <p className="type-detail-small-medium text-grey-400">{author.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#FFF7ED] text-[#F97316] type-desc-small-semibold px-3 py-1 rounded-full uppercase">
            {author.role}
          </span>
          <button className="text-grey-400 hover:text-grey-500 cursor-pointer">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-grey-900 mb-4 tracking-tight leading-tight">
        {title}
      </h2>
      <p className="type-desc text-grey-500 leading-relaxed mb-4">
        {bodyText}
      </p>

      <div className="mb-6">
        <a
          href={attachmentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline break-all block leading-normal"
        >
          {attachmentLink}
        </a>
      </div>

      <div className="flex items-center gap-6 py-4 border-b border-border type-detail text-grey-500">
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <ThumbsUp size={18} /> {likes}
        </button>
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <MessageSquare size={18} /> {comments}
        </button>
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <Share2 size={18} /> Share
        </button>
      </div>

      <div className="flex items-center gap-3 mt-6">
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
    </div>
  );
}