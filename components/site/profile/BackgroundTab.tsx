"use client";

import React from "react";
import { Download, ClipboardList } from "lucide-react";
import { UserProfilePayload } from "@/types/profile-types";

interface BackgroundTabProps {
  profile: UserProfilePayload | null;
  loading: boolean;
}

export default function BackgroundTab({ profile, loading }: BackgroundTabProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-48 w-full">
        <p className="text-muted-foreground animate-pulse">Loading background details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-48 w-full">
        <p className="text-destructive">Failed to load background metadata.</p>
      </div>
    );
  }

  const parsedSkills = profile.skills?.[0]
    ? profile.skills[0].split(",").map((s) => s.trim())
    : [];

  const hasResume = !!(
    profile.cvResumeUrl &&
    profile.cvResumeUrl !== "null" &&
    profile.cvResumeUrl.trim() !== ""
  );

  const handleDownloadCV = async (e: React.MouseEvent) => {
    if (!hasResume || !profile.cvResumeUrl) return;
    
    try {
      const response = await fetch(profile.cvResumeUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `CV_${profile.appUser?.firstName || "User"}_Resume.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(profile.cvResumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="type-subtitle-24 text-primary mb-6">Education</h3>
        <div className="space-y-6">
          {profile.education?.map((edu, index) => (
            <div
              key={index}
              className="flex gap-4 items-start pb-6 border-b border-border last:border-0 last:pb-0"
            >
              <div className="w-12 h-12 rounded-lg border border-border bg-grey-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                  {edu.institutionAbbreviation || edu.institutionName.slice(0, 2)}
                </div>
              </div>
              <div>
                <h4 className="type-detail-semibold text-secondary">{edu.degree}</h4>
                <p className="type-desc-semibold text-primary">{edu.institutionName}</p>
                <p className="type-detail-small-medium text-muted-foreground mt-1">
                  {edu.startYear} – {edu.isCurrent ? "Present" : edu.endYear ?? ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="type-subtitle text-primary mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {parsedSkills.length > 0 ? (
            parsedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-muted text-primary px-3 py-1.5 rounded-full type-desc-small-semibold transition-colors duration-150 hover:bg-grey-100"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="type-desc text-muted-foreground">No skills listed yet.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="type-subtitle-24 text-primary mb-4">Resume</h3>
        {hasResume ? (
          <div
            onClick={handleDownloadCV}
            className="flex items-center justify-between p-4 border border-border rounded-lg bg-grey-50 group cursor-pointer hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <ClipboardList
                size={20}
                className="text-secondary group-hover:text-primary transition-colors shrink-0"
              />
              <span className="type-desc-medium text-secondary">
                CV_{profile.appUser?.firstName || "User"}_Resume.pdf
              </span>
            </div>
            <Download
              size={20}
              className="text-secondary group-hover:text-primary transition-colors"
            />
          </div>
        ) : (
          <div className="p-4 border border-dashed border-border rounded-lg bg-grey-25/50 text-center type-desc text-muted-foreground">
            No resume file uploaded yet.
          </div>
        )}
      </section>
    </div>
  );
}