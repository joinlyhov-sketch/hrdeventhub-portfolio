"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Megaphone,
  Calendar,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import type { UserRole } from "../../../data/mock-user";

interface SearchEventProps {
  role: UserRole;
  onFilterChange: (category: string | null) => void;
  activeFilter: string | null;
}

export default function SearchEvent({
  role,
  onFilterChange,
  activeFilter,
}: SearchEventProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const groupId = params.groupId;

  const categories = [
    { label: "Announcement", value: "announcement", icon: Megaphone },
    { label: "Article", value: "article", icon: FileText },
    { label: "Event", value: "event", icon: Calendar },
    { label: "Survey", value: "survey", icon: CheckCircle2 },
    { label: "Poll", value: "poll", icon: BarChart3 },
  ];

  const closeDetailsDropdown = (e: React.MouseEvent<HTMLElement>) => {
    const details = e.currentTarget.closest("details");
    if (details) details.removeAttribute("open");
  };

  const handleCreateNavigation = (value: string) => {
    setIsCreateOpen(false);
    if (groupId && groupId !== "null") {
      router.push(`/event-management/creation/${value}?groupId=${groupId}`);
    } else {
      router.push(`/event-management/creation/${value}`);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-8 relative">
      <div className="relative grow">
        <input
          type="text"
          placeholder="Search for events..."
          className="w-full pl-6 pr-12 py-3 border border-grey-100 rounded-full type-detail outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
          <Search size={18} />
        </button>
      </div>

      <details className="relative group [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full type-detail-semibold hover:bg-primary-hover transition-all cursor-pointer shadow-sm whitespace-nowrap list-none select-none">
          <Filter size={18} />
          {activeFilter ? `Filtered: ${activeFilter}` : "Filter by category"}
        </summary>
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={(e) =>
            e.currentTarget.closest("details")?.removeAttribute("open")
          }
        />

        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {activeFilter && (
            <button
              onClick={(e) => {
                onFilterChange(null);
                closeDetailsDropdown(e);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all mb-1 cursor-pointer"
            >
              Clear Filter
            </button>
          )}
          {categories.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={(e) => {
                  onFilterChange(option.value);
                  closeDetailsDropdown(e);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:cursor-pointer font-medium rounded-xl transition-all duration-150 relative z-50 ${
                  activeFilter === option.value
                    ? "bg-blue-50 text-primary font-semibold"
                    : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-900"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    activeFilter === option.value
                      ? "text-primary"
                      : "text-gray-500"
                  }
                />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </details>
      {role === "admin" && (
        <div className="relative">
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="bg-primary p-2 text-white rounded-full hover:bg-primary-hover transition-all cursor-pointer shadow-sm flex items-center justify-center overflow-hidden w-[46px] h-[46px] relative z-50"
          >
            <div
              className={`transform transition-transform duration-300 flex items-center justify-center ${isCreateOpen ? "rotate-45" : "rotate-0"}`}
            >
              <Plus size={30} />
            </div>
          </button>

          {isCreateOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsCreateOpen(false)}
              />

              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {categories.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleCreateNavigation(option.value)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50/50 hover:text-blue-900 rounded-xl transition-all duration-150 relative z-50 cursor-pointer"
                    >
                      <Icon
                        size={18}
                        className="text-gray-500 group-hover:text-blue-900"
                      />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
