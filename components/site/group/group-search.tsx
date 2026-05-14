"use client";

import { Search, Settings2, Plus } from "lucide-react";

export default function GroupSearch({ role }: { role: string }) {
  return (
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

      {role === "admin" && (
        <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-[#25437a] transition-all whitespace-nowrap">
          Create
          <Plus size={20} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}