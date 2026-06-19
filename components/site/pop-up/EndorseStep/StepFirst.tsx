"use client";

import { Search, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { AVAILABLE_SKILLS } from "@/data/endorse-skills";

interface Step1Props {
  studentName: string;
  skillQuery: string;
  setSkillQuery: (v: string) => void;
  selectedSkill: string | null;
  setSelectedSkill: (v: string | null) => void;
}

export default function StepFirst({
  studentName,
  skillQuery,
  setSkillQuery,
  selectedSkill,
  setSelectedSkill,
}: Step1Props) {
  const firstName = studentName.split(" ")[0];

  const filtered = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();
    const uniqueSkills = Array.from(new Set(AVAILABLE_SKILLS));

    if (!query) {
      return uniqueSkills;
    }

    return uniqueSkills.filter((skill) =>
      skill.toLowerCase().includes(query)
    );
  }, [skillQuery]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-sm text-grey-500 leading-relaxed">
        Select the skill that best reflects{" "}
        <span className="font-semibold text-secondary">{firstName}</span>&apos;s
        contribution during your shared event.
      </p>

      <div className="relative w-full">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 pointer-events-none"
        />

        <input
          type="text"
          value={skillQuery}
          onChange={(e) => setSkillQuery(e.target.value)}
          placeholder="Search skills…"
          className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors text-sm text-secondary placeholder:text-grey-400"
        />
      </div>

      {selectedSkill && (
        <div className="w-full rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm text-secondary truncate">
            Selected skill:{" "}
            <span className="font-semibold text-primary">{selectedSkill}</span>
          </p>
        </div>
      )}

      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-secondary">
            Available Skills
          </p>
        </div>

        <div className="h-[166px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent">
          <div className="grid grid-cols-2 gap-2">
            {filtered.length > 0 ? (
              filtered.map((skill) => {
                const active = selectedSkill === skill;

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSelectedSkill(active ? null : skill)}
                    className={`h-[48px] min-w-0 flex items-center justify-between px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left ${
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-background text-secondary hover:border-grey-300 hover:bg-grey-50"
                    }`}
                  >
                    <span className="truncate min-w-0">{skill}</span>

                    {active && (
                      <CheckCircle2
                        size={16}
                        className="text-primary shrink-0 ml-2"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 h-[150px] flex items-center justify-center rounded-xl border border-dashed border-border">
                <p className="text-sm text-grey-400 text-center">
                  No matching skills found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}