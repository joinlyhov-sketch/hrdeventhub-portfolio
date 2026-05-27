"use client";

import { useState } from "react";
import Search from "@/components/site/search/Search";

const ALL_MEMBERS = [
  { name: "Hiem Sreynit", img: "https://i.pravatar.cc/100?u=hiem" },
  { name: "Ty Dine", img: "https://i.pravatar.cc/100?u=ty" },
  { name: "Lyhov", img: "https://i.pravatar.cc/100?u=lyhov" },
  { name: "Nem Sophal", img: "https://i.pravatar.cc/100?u=nem" },
  { name: "Dita Rector", img: "https://i.pravatar.cc/100?u=dita" },
  { name: "Kaknika", img: "https://i.pravatar.cc/100?u=kaknika" },
  { name: "Sathim", img: "https://i.pravatar.cc/100?u=sathim" },
  { name: "Ja Morant", img: "https://i.pravatar.cc/100?u=ja" },
  { name: "Stephen Curry", img: "https://i.pravatar.cc/100?u=curry" },
  { name: "Lebron James", img: "https://i.pravatar.cc/100?u=lebron" },
];

export default function GroupMemberCard() {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = ALL_MEMBERS.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedMembers = showAll ? filteredMembers : ALL_MEMBERS.slice(0, 3);

  return (
    <div className="w-full max-w-md bg-background rounded-[12px] border border-border p-5 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h3 className="type-subtitle font-extrabold text-primary leading-tight truncate">
            Group Member
          </h3>
          <p className="type-detail-small-medium text-grey-400">60 Members</p>
        </div>
        <div className="flex items-center -space-x-2 shrink-0 select-none">
          <img
            src="https://i.pravatar.cc/100?u=hiem"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            alt="m1"
          />
          <img
            src="https://i.pravatar.cc/100?u=ty"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            alt="m2"
          />
          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary type-detail-small-medium text-white flex items-center justify-center font-bold text-xs">
            +57
          </div>
        </div>
      </div>

      {showAll && (
        <div className="mb-5 animate-in fade-in duration-200">
          <Search
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for members..."
          />
        </div>
      )}

      <div
        className={`space-y-4 mb-3 pr-2 pl-2 ${
          showAll ? "max-h-[320px] overflow-y-auto pr-1" : ""
        }`}
      >
        {displayedMembers.length > 0 ? (
          displayedMembers.map((member, i) => (
            <div key={i} className="flex items-center gap-3 min-w-0 w-full">
              <img
                src={member.img}
                className="w-10 h-10 rounded-full object-cover shrink-0"
                alt={member.name}
              />
              <span className="type-detail-semibold text-primary grow min-w-0 truncate">
                {member.name}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            No members found matching "{searchQuery}"
          </p>
        )}
      </div>

      <button
        onClick={() => {
          setShowAll(!showAll);
          if (showAll) setSearchQuery("");
        }}
        className="w-full bg-primary text-white py-3 rounded-2xl type-detail-semibold hover:bg-primary-hover transition-all cursor-pointer text-center font-medium"
      >
        {showAll ? "View Less Members" : "View All Members"}
      </button>
    </div>
  );
}