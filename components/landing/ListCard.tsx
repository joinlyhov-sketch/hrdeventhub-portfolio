import React from "react";
import type { MediaItem } from "./types";

export interface MediaItems{
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;   
}
interface ListCardProps {
  item: MediaItem;
}

export default function MediaListSection() {
  const customCardsData: MediaItem[] = [
    {
      id: "card-1",
      category: "Success Story",
      title: "Gen 13 Graduate Secure Global Roles",
      description: "Congratulations to our latest graduates! 95% employment rate within 2 months of completing the software engineering.",
      imageUrl: "/images/songkran.png" 
    },
    {
      id: "card-2",
      category: "Alumni Spotlight",
      title: "How John landed a Remote Dev Job in 3 Months",
      description: "From working in hospitality to writing code full-time. Read Nika's inspiring transition journey.",
      imageUrl: "/images/alumni.png"
    },
    {
      id: "card-3",
      category: "Event",
      title: "Demo Day: Showcasing Gen 13 Capstones",
      description: "Watch our graduates pitch their production-ready web applications to top tech companies and investors.",
      imageUrl: "/images/gen13.png"
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {customCardsData.map((data) => (
        <ListCard key={data.id} item={data} />
      ))}
    </div>
  );
};
export const ListCard: React.FC<ListCardProps> = ({ item }) => {
  return (
    <div className="flex items-center w-full gap-4 p-4 border border-border rounded-xl bg-card shadow-sm ">
      <div className="relative w-25 h-25 rounded-lg overflow-hidden shrink-0 bg-grey-100">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-grey-900/20 flex items-center justify-center">
          <button className="w-8 h-8 flex items-center justify-center shadow text-secondary hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.75 17.5038V13.6101C8.75 8.78301 12.1771 6.79968 16.3625 9.22051L19.7312 11.1747L23.1 13.1288C27.2854 15.5497 27.2854 19.5018 23.1 21.9226L19.7312 23.8768L16.3625 25.8309C12.1771 28.208 8.75 26.2393 8.75 21.3976V17.5038Z"
                fill="#f0f4f9"
                stroke="#f1f3f6"
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
        <span className="type-detail-small-medium text-secondary bg-muted px-2 py-0.5 rounded-full uppercase">
          {item.category}
        </span>
        <h4 className="type-subtitle text-secondary line-clamp-1 w-full">
          {item.title}
        </h4>
        {item.description && (
          <p className="type-detail text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

