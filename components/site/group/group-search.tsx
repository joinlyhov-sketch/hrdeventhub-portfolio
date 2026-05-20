"use client";

import { Settings2, Plus } from "lucide-react";
import Search from "../Search";

export default function GroupSearch({ role }: { role: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 w-full">
      <Search />
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