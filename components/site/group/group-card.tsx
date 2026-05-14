
import Link from "next/link";
import { Lock, Globe, MoreHorizontal, Link2 } from "lucide-react";
import { Group } from "../../../data/groups";

interface GroupCardProps {
  group: Group;
  role: string;
}

export default function GroupCard({ group, role }: GroupCardProps) {
  const isInternal = group.type === "Internal";

  return (
    <div className="bg-white p-8 rounded-[35px] border border-gray-100 flex flex-col shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50/40 to-transparent rounded-tr-[35px] pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F2F5] text-xs font-bold text-primary">
          {isInternal ? (
            <Lock size={14} fill="currentColor" />
          ) : (
            <Globe size={14} />
          )}
          {group.type}
        </span>

        {role === "admin" ? (
          <button className="text-gray-400 hover:text-primary">
            <MoreHorizontal size={24} />
          </button>
        ) : (
          <button className="text-[#EFCF8B] hover:scale-110 transition-transform">
            <Link2 size={24} />
          </button>
        )}
      </div>

      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#1C4D8D] to-[#FFA02E] bg-clip-text text-transparent mb-3 uppercase tracking-wide group-hover:text-primary transition-colors">
        {group.title}
      </h2>

      <p className="text-gray-500 text-lg leading-relaxed mb-10">
        {group.description}
      </p>

      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center -space-x-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm"
            >
              <img
                src={`https://i.pravatar.cc/150?u=${group.id}${i}`}
                alt="user profile"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white bg-[#EBF5FB] flex items-center justify-center text-[#3FA6DC] text-xs font-bold shadow-sm">
            +{group.memberCount - 3}
          </div>
        </div>

        <Link href={`/event`}>
          <button className="bg-primary text-white px-7 py-3 rounded-xl text-sm font-bold hover:bg-[#C5A358] transition-all shadow-sm">
            View Group
          </button>
        </Link>
      </div>
    </div>
  );
}
