"use client";
 
import { Search, CheckCircle2 } from "lucide-react";
interface Step1Props {
  studentName: string;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  availableSkills: string[];
  selectedSkill: string | null;
  setSelectedSkill: (v: string | null) => void;
}
 
export default function StepFirst({
  studentName,
  searchQuery,
  setSearchQuery,
  availableSkills,
  selectedSkill,
  setSelectedSkill,
}: Step1Props) {
  const firstName = studentName.split(" ")[0];
  const filtered = availableSkills.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-grey-500 leading-relaxed">
        Select the skill that best reflects{" "}
        <span className="font-semibold text-secondary">{firstName}</span>'s
        contribution during your shared event.
      </p>
 
      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills..."
          className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors text-sm text-secondary placeholder:text-grey-400"
        />
      </div>
 
      {/* Skill Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.length > 0 ? (
          filtered.map((skill) => {
            const active = selectedSkill === skill;
            return (
              <button
                key={skill}
                type="button"
                onClick={() => setSelectedSkill(active ? null : skill)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left ${
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-secondary hover:border-grey-300 hover:bg-grey-50"
                }`}
              >
                <span>{skill}</span>
                {active && (
                  <CheckCircle2 size={16} className="text-primary shrink-0 ml-2" />
                )}
              </button>
            );
          })
        ) : (
          <p className="col-span-2 text-sm text-grey-400 text-center py-4">
            No matching skills found.
          </p>
        )}
      </div>
    </div>
  );
}