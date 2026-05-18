
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
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isInternal 
            ? "bg-[linear-gradient(225deg,#F6F0EC_17%,#FDFDFD_42%)]" 
            : "bg-[linear-gradient(225deg,#ECF0F6_17%,#FDFDFD_42%)]"
        } opacity-90`} 
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F2F5] text-xs font-bold text-primary">
            {isInternal ? <Lock size={14} fill="currentColor" /> : <Globe size={14} />}
            {group.type}
          </span>

          {role === "admin" ? (
            <button className="text-gray-400 hover:text-primary cursor-pointer">
              <MoreHorizontal size={24} />
            </button>
          ) : (
            <div className="p-2 rounded-full border border-[#FFD7A1] text-[#EFCF8B] hover:scale-110 transition-transform cursor-pointer">
              <Link2 size={20} />
            </div>
          )}
        </div>

        <h2 className="text-[24px] font-extrabold bg-gradient-to-r from-[#1C4D8D] to-[#B38B4D] bg-clip-text text-transparent mb-3 uppercase tracking-wide">
          {group.title}
        </h2>

        <p className="text-[#0F2854] font-semibold text-[14px] leading-relaxed mb-10">
          {group.description}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${group.id}${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#EBF5FB] flex items-center justify-center text-[#3FA6DC] text-xs font-bold shadow-sm">
              +{group.memberCount - 3}
            </div>
          </div>

          <Link href={`/group/${group.id}`}>
            <button className="bg-[#1C4D8D] text-white px-7 py-3 rounded-xl text-sm hover:bg-[#FFA02E] transition-all shadow-sm cursor-pointer">
              View Group
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
