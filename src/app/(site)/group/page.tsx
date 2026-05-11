"use client";

import GroupHeader from "@/components/group/GroupHeader";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Settings2, 
  Plus, 
  Lock, 
  Globe, 
  MoreHorizontal, 
  Link2
} from "lucide-react";

interface Group {
  id: number;
  type: "Internal" | "External";
  title: string;
  description: string;
  memberCount: number;
}

const mockGroups: Group[] = [
  { id: 1, type: "Internal", title: "14th Generation Group", description: "Connect with the 14th generation and grow your network.", memberCount: 52 },
  { id: 2, type: "External", title: "HRD Center Alumni", description: "Connect with the 14th generation and grow your network.", memberCount: 52 },
  { id: 3, type: "Internal", title: "14th Generation Group", description: "Connect with the 14th generation and grow your network.", memberCount: 52 },
  { id: 4, type: "Internal", title: "14th Generation Group", description: "Connect with the 14th generation and grow your network.", memberCount: 52 },
  { id: 5, type: "Internal", title: "14th Generation Group", description: "Connect with the 14th generation and grow your network.", memberCount: 52 },
  { id: 6, type: "External", title: "HRD Center Alumni", description: "Connect with the 14th generation and grow your network.", memberCount: 52 },
];

export default function GroupPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole] = useState<"admin" | "alumni">("alumni");

  useEffect(() => {
    setGroups(mockGroups);
    setLoading(false);
  }, []);

  return (
    <>
      <GroupHeader userRole={userRole} />
      <div className="flex items-center gap-2 mb-6 w-full">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search for group..."
            className="w-full pl-6 pr-14 py-3 border border-gray-200 rounded-full text-base focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-gray-400 shadow-sm"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <button className="bg-primary p-2 rounded-full text-white hover:bg-[#25437a]">
              <Search size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <button className="p-4 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all">
          <Settings2 size={24} className="text-gray-600" />
        </button>

        {userRole === "admin" && (
          <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-[#25437a] transition-all whitespace-nowrap">
            Create
            <Plus size={20} strokeWidth={3} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-xl font-medium">
          Loading groups...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} role={userRole} />
          ))}
        </div>
      )}
    </>
  );
}

function GroupCard({ group, role }: { group: Group; role: string }) {
  const isInternal = group.type === "Internal";

  return (
    <div className="bg-white p-8 rounded-[35px] border border-gray-100 flex flex-col shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50/40 to-transparent rounded-tr-[35px] pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F2F5] text-xs font-bold text-primary">
          {isInternal ? <Lock size={14} fill="currentColor" /> : <Globe size={14} />}
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
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
              <img
                src={`https://i.pravatar.cc/150?u=${group.id}${i}`}
                alt="user"
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