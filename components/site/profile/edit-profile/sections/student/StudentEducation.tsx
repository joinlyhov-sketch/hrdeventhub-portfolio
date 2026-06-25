"use client";

import React from "react";
import { Building2, ChevronDown, Trash2 } from "lucide-react";
import { University } from "@/service/profile.service";

export type EducationEntry = {
  institutionName: string;
  institutionAbbreviation: string;
  institutionLogo: string;
  degree: string;
  startYear: number | string;
  endYear: number | null;
  isCurrent: boolean;
};

export const DEGREE_ABBREVIATION_OPTIONS = [
  { value: "AA", label: "Associate's Degree" },
  { value: "BA", label: "Bachelor's Degree" },
  { value: "MA", label: "Master's Degree" },
  { value: "PhD", label: "PhD: Doctor of Philosophy" },
];

interface StudentEducationProps {
  education: EducationEntry[];
  setEducation: (val: EducationEntry[] | ((prev: EducationEntry[]) => EducationEntry[])) => void;
  openUniversityIndex: number | null;
  setOpenUniversityIndex: (val: number | null) => void;
  openAbbreviationIndex: number | null;
  setOpenAbbreviationIndex: (val: number | null) => void;
  universitySearch: Record<number, string>;
  setUniversitySearch: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  universities: University[];
  isLoadingUniversities: boolean;
  educationErrors: { startYear?: string; endYear?: string }[];
  setEducationErrors: React.Dispatch<React.SetStateAction<{ startYear?: string; endYear?: string }[]>>;
  handleUpdateEducation: (index: number, fields: Partial<EducationEntry>) => void;
}

export default function StudentEducation({
  education,
  setEducation,
  openUniversityIndex,
  setOpenUniversityIndex,
  openAbbreviationIndex,
  setOpenAbbreviationIndex,
  universitySearch,
  setUniversitySearch,
  universities,
  isLoadingUniversities,
  educationErrors,
  setEducationErrors,
  handleUpdateEducation,
}: StudentEducationProps) {
  return (
    <div className="space-y-4 w-full mt-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="type-subtitle-24 text-primary">Education</h2>
        <button
          type="button"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                institutionAbbreviation: "",
                institutionLogo: "",
                degree: "",
                startYear: 2026,
                endYear: null,
                isCurrent: true,
              },
            ])
          }
          className="text-subtle type-detail-semibold flex items-center gap-1 hover:underline bg-transparent border-0 cursor-pointer"
        >
          + add
        </button>
      </div>
      {education.map((edu, idx) => (
        <div
          key={idx}
          className="type-desc-semibold text-primary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full border-b border-dashed border-border pb-4 last:border-0 relative"
        >
          {idx > 0 && (
            <button
              type="button"
              onClick={() => setEducation(education.filter((_, i) => i !== idx))}
              className="absolute -top-1 -right-1 text-destructive hover:opacity-80 cursor-pointer border-0 bg-transparent"
            >
              <Trash2 size={14} />
            </button>
          )}
          <div className="flex flex-col gap-1.5 w-full relative">
            <label className="type-detail-semibold text-secondary">
              University/Institute/Center
            </label>

            <div className="relative">
              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="text"
                value={
                  openUniversityIndex === idx
                    ? universitySearch[idx] || ""
                    : edu.institutionName
                }
                placeholder={
                  isLoadingUniversities
                    ? "Loading schools..."
                    : "Search university..."
                }
                onFocus={() => {
                  setOpenUniversityIndex(idx);
                  setOpenAbbreviationIndex(null);
                  setUniversitySearch((prev) => ({
                    ...prev,
                    [idx]: "",
                  }));
                }}
                onChange={(e) => {
                  setOpenUniversityIndex(idx);
                  setUniversitySearch((prev) => ({
                    ...prev,
                    [idx]: e.target.value,
                  }));
                }}
                className="w-full h-10 pl-9 pr-9 bg-white border border-border rounded-lg type-detail text-[#1C4E8D] focus:outline-hidden focus:border-primary"
              />

              <ChevronDown
                size={16}
                onClick={() => {
                  setOpenUniversityIndex(
                    openUniversityIndex === idx ? null : idx,
                  );
                  setOpenAbbreviationIndex(null);
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer transition-transform ${
                  openUniversityIndex === idx ? "rotate-180" : ""
                }`}
              />
            </div>

            {openUniversityIndex === idx && (
              <div className="absolute left-0 right-0 top-[68px] z-50 bg-white border border-blue-100 rounded-xl shadow-xl max-h-[220px] overflow-y-auto unique-scrollbar p-1">
                {(() => {
                  const search = (universitySearch[idx] || "").toLowerCase();

                  const filteredUniversities = universities.filter((university) =>
                    university.name.toLowerCase().includes(search),
                  );

                  if (isLoadingUniversities) {
                    return (
                      <div className="text-[14px] text-gray-400 px-4 py-3 text-center">
                        Loading schools...
                      </div>
                    );
                  }

                  if (filteredUniversities.length === 0) {
                    return (
                      <div className="text-[14px] text-gray-400 px-4 py-3 text-center">
                        No universities found.
                      </div>
                    );
                  }

                  return filteredUniversities.map((university) => (
                    <div
                      key={university.universityId}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleUpdateEducation(idx, {
                          institutionName: university.name,
                          institutionLogo: university.logoUrl || "",
                        });

                        setUniversitySearch((prev) => ({
                          ...prev,
                          [idx]: "",
                        }));

                        setOpenUniversityIndex(null);
                      }}
                      className={`flex items-center gap-3 text-[15px] px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        edu.institutionName === university.name
                          ? "bg-blue-50 text-[#1e3a8a] font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {university.logoUrl ? (
                        <img
                          src={university.logoUrl}
                          alt={university.name}
                          className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                          <Building2 size={14} className="text-[#1e3a8a]" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate">{university.name}</p>
                        {university.location && (
                          <p className="text-xs text-gray-400 truncate">
                            {university.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 w-full relative">
            <label className="type-detail-semibold text-secondary">
              Institution Abbreviation
            </label>

            <button
              type="button"
              onClick={() => {
                setOpenAbbreviationIndex(
                  openAbbreviationIndex === idx ? null : idx,
                );
                setOpenUniversityIndex(null);
              }}
              className="w-full h-10 px-3 pr-9 bg-white border border-border rounded-lg type-detail text-[#1C4E8D] flex items-center text-left cursor-pointer"
            >
              {edu.institutionAbbreviation || "Select abbreviation"}
            </button>

            <ChevronDown
              size={16}
              onClick={() => {
                setOpenAbbreviationIndex(
                  openAbbreviationIndex === idx ? null : idx,
                );
                setOpenUniversityIndex(null);
              }}
              className={`absolute right-3 top-[34px] text-gray-400 cursor-pointer transition-transform ${
                openAbbreviationIndex === idx ? "rotate-180" : ""
              }`}
            />

            {openAbbreviationIndex === idx && (
              <div className="absolute left-0 right-0 top-[68px] z-50 bg-white border border-blue-100 rounded-xl shadow-xl overflow-hidden p-1">
                {DEGREE_ABBREVIATION_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      handleUpdateEducation(idx, {
                        institutionAbbreviation: option.value,
                      });
                      setOpenAbbreviationIndex(null);
                    }}
                    className={`text-[14px] px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      edu.institutionAbbreviation === option.value
                        ? "bg-blue-50 text-[#1e3a8a] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="type-detail-semibold text-secondary">
              Major/Course
            </label>
            <input
              type="text"
              value={edu.degree}
              placeholder="Computer Science"
              onChange={(e) =>
                handleUpdateEducation(idx, { degree: e.target.value.replace(/[^a-zA-Z\s.-]/g, "") })
              }
              className="w-full h-10 px-3 bg-white border border-border rounded-lg type-detail text-[#1C4E8D] focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="type-detail-semibold text-secondary">
              Start year
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={edu.startYear || ""}
              placeholder="2023"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                handleUpdateEducation(idx, {
                  startYear: value ? Number(value) : "",
                });

                setEducationErrors((prev) => {
                  const copy = [...prev];
                  copy[idx] = {
                    ...copy[idx],
                    startYear: "",
                  };
                  return copy;
                });
              }}
              className={`w-full h-10 px-3 bg-white border rounded-lg type-detail text-[#1C4E8D]
${educationErrors[idx]?.startYear ? "border-red-500" : "border-border"}`}
            />

            {educationErrors[idx]?.startYear && (
              <p className="text-red-500 text-xs">
                {educationErrors[idx].startYear}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="type-detail-semibold text-secondary">
              End year
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={edu.endYear ?? ""}
              placeholder="2026"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                handleUpdateEducation(idx, {
                  endYear: value ? Number(value) : null,
                });

                setEducationErrors((prev) => {
                  const copy = [...prev];
                  copy[idx] = {
                    ...copy[idx],
                    endYear: "",
                  };
                  return copy;
                });
              }}
              className={`w-full h-10 px-3 bg-white border rounded-lg type-detail text-[#1C4E8D]
              ${educationErrors[idx]?.endYear ? "border-red-500" : "border-border"}`}
            />

            {educationErrors[idx]?.endYear && (
              <p className="text-red-500 text-xs font-light">
                {educationErrors[idx].endYear}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
