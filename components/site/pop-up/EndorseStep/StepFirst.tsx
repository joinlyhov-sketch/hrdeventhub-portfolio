"use client";

import { Search } from "lucide-react";

interface Step1Props {
  studentName: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availableSkills: string[];
  selectedSkill: string | null;
  setSelectedSkill: (skill: string) => void;
}

export default function Step1({
  studentName,
  searchQuery,
  setSearchQuery,
  availableSkills,
  selectedSkill,
  setSelectedSkill,
}: Step1Props) {
  const filteredSkills = availableSkills.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-5">
      <p className="type-detail-medium text-grey-500 leading-relaxed">
        Choose which skill you want to endorse for <span className="type-detail-semibold text-secondary">{studentName}</span>. This will
        be visible on their professional profile.
      </p>

      <div className="relative w-full">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills..."
          className="w-full bg-grey-100 border-none rounded-xl py-3.5 pl-11 pr-5 type-detail-medium text-grey-900 placeholder:text-grey-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkill === skill;
          return (
            <button
              key={skill}
              type="button"
              onClick={() => setSelectedSkill(skill)}
              className={`px-5 py-3 rounded-full type-detail-semibold transition-all cursor-pointer border ${
                isSelected
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-grey-100 border-transparent text-grey-900 hover:bg-grey-200"
              }`}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}