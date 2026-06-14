"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Settings2, CirclePlus, Check } from "lucide-react";
import Search from "../search/Search";
import CreateGroupModal from "@/components/site/pop-up/action-button/CreateGroupForm";
import { useCurrentUser } from "@/context/user-context";


interface GroupSearchProps {
  initialSearchValue: string; 
}

export default function GroupSearch({
  initialSearchValue,
}: GroupSearchProps) {
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearchValue);
  const currentType = searchParams.get("type") || "All";
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleFilterSelect = (typeValue: string) => {
    const params = new URLSearchParams(window.location.search);

    if (typeValue !== "All") {
      params.set("type", typeValue);
    } else {
      params.delete("type");
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  };

  return (
     <div className="flex items-center gap-x-2 md:gap-x-4 mb-6 w-full relative">
      <Search
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search for groups..."
      />

      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-2 border rounded-xl transition-all shrink-0 cursor-pointer h-10.5 w-10.5 flex items-center justify-center box-border rotate-90 ${
            isFilterOpen || currentType !== "All"
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-gray-200 text-gray-600 hover:bg-white hover:shadow-md"
          }`}
        >
          <Settings2 size={24} />
        </button>

        {isFilterOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {[
              { label: "All Types", value: "All" },
              { label: "Internal", value: "Internal" },
              { label: "External", value: "External" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect(option.value)}
                className="w-full text-left px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer tracking-tight"
              >
                {option.label}
                {currentType === option.value && (
                  <Check size={16} className="text-primary" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentUser?.role === "admin" && (
      <button onClick={() => setIsCreateOpen(true)}
      className="flex items-center gap-1.5 md:gap-2 bg-primary text-white px-3 md:px-4 py-2 rounded-xl text-sm md:text-base font-medium hover:bg-[#25437a] transition-all whitespace-nowrap shrink-0 cursor-pointer h-10.5 box-border"
      >
        <span className="hidden sm:inline">Create</span>
        <CirclePlus size={20} strokeWidth={2} />
      </button>
      )}

      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
