"use client";

import React from "react";
import { CircleX } from "lucide-react";

interface StudentSkillsProps {
  skills: string[];
  setSkills: (val: string[]) => void;
  setIsSkillModalOpen: (val: boolean) => void;
}

export default function StudentSkills({ skills, setSkills, setIsSkillModalOpen }: StudentSkillsProps) {
  return (
    <div className="space-y-3 w-full">
      <label className="type-desc text-secondary block">
        Skills & Expertise
      </label>
      <div className="flex flex-wrap gap-2 items-center">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 bg-[#E1F1FD] text-primary px-2.5 py-3 rounded-xl type-detail-medium"
          >
            {skill}
            <CircleX
              className="w-3 h-3 text-primary cursor-pointer hover:text-destructive transition-colors"
              onClick={() =>
                setSkills(skills.filter((_, i) => i !== index))
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIsSkillModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-3 border border-[#C1D8F0] rounded-xl text-secondary type-detail-medium bg-white hover:bg-grey-50 cursor-pointer"
        >
          + Add Skill
        </button>
      </div>
    </div>
  );
}
