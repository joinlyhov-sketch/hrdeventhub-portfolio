import Link from "next/link";
import { Lock, Globe, Link2 } from "lucide-react";
import { Group } from "../../../data/groups";
import GroupDropDown from "../pop-up/action-button/action-button-group";

interface GroupCardProps {
  group: Group;
  role: string;
}

export default function GroupCard({ group, role }: GroupCardProps) {
  const isInternal = group.type === "Internal";

  return (
    <div className="bg-card p-5 rounded-2xl border border-border flex flex-col shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isInternal 
            ? "bg-[linear-gradient(225deg,#F6F0EC_17%,#FDFDFD_42%)]" 
            : "bg-[linear-gradient(225deg,#FDFDFD_42%)]"
        } opacity-90`} 
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted type-detail-small-medium text-primary">
            {isInternal ? <Lock size={14}  /> : <Globe size={14} />}
            {group.type}
          </span>

          {role === "admin" ? (
            <GroupDropDown group={group} />
          ) : (
            <div className="p-2 rounded-full border border-[#FFD7A1] text-[#EFCF8B] hover:scale-110 transition-transform cursor-pointer">
              <Link2 size={20} />
            </div>
          )}
        </div>

        <h2 className="type-subtitle-24 font-extrabold bg-gradient-to-r from-primary to-[#B38B4D] bg-clip-text text-transparent mb-3 uppercase tracking-wide">
          {group.title}
        </h2>

        <p className="text-secondary type-detail leading-relaxed mb-10">
          {group.description}
        </p>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${group.id}${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#EBF5FB] flex items-center justify-center text-[#3FA6DC] type-desc-small-semibold shadow-sm">
              +{group.memberCount - 3}
            </div>
          </div>

          <Link href={`/group/${group.id}`}>
            <button className="bg-primary text-primary-foreground px-7 py-3 rounded-md type-detail-semibold hover:bg-action hover:text-action-foreground transition-all shadow-sm cursor-pointer">
              View Group
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}