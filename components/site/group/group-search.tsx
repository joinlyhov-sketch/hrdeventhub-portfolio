"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Settings2, Plus } from "lucide-react";
import Search from "../search/Search";

interface GroupSearchProps {
  role: string;
  initialSearchValue: string;
}

export default function GroupSearch({ role, initialSearchValue }: GroupSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearchValue);

  useEffect(() => {
    setSearch(initialSearchValue);
  }, [initialSearchValue]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(window.location.search);
    
    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 mb-6 w-full">
      <Search
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search for groups..."
      />
      <button className="p-2 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all shrink-0">
        <Settings2 size={24} className="text-gray-600" />
      </button>

      {role === "admin" && (
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-base font-bold hover:bg-[#25437a] transition-all whitespace-nowrap shrink-0">
          Create
          <Plus size={20} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}