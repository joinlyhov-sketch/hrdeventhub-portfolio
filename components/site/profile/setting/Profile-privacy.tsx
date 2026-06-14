"use client";

import React, { useMemo } from "react";
import {
  Eye,
  Mail,
  Code,
  Phone,
  GraduationCap,
  Cake,
  Users,
  BookOpen,
  FileText,
} from "lucide-react";
import { UserProfilePayload } from "@/service/profile.service";
import { getMediaUrl } from "@/libs/media";
import type {
  VisibilityMode,
  SelectiveVisibility,
} from "./PrivacySettingsClient";

interface ProfileCardProps {
  profile: UserProfilePayload;
  visibilityMode: VisibilityMode;
  selectiveConfig: SelectiveVisibility;
}

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2.5 w-full min-w-0">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="text-xs text-grey-900 truncate">{text}</span>
  </div>
);

const GenderIcon = ({ gender }: { gender: string }) => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    {gender === "F" ? (
      <>
        <path d="M7.6875 16.125C10.8977 16.125 13.5 13.5227 13.5 10.3125C13.5 7.10234 10.8977 4.5 7.6875 4.5C4.47734 4.5 1.875 7.10234 1.875 10.3125C1.875 13.5227 4.47734 16.125 7.6875 16.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.125 1.875L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.25 1.875H16.125V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <>
        <path d="M10.5 7.5C10.5 9.98528 8.48528 12 6 12C3.51472 12 1.5 9.98528 1.5 7.5C1.5 5.01472 3.51472 3 6 3C8.48528 3 10.5 5.01472 10.5 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.5 1.5L11.25 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 1.5H16.5V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </svg>
);

const formatDate = (dateString?: string): string => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function isFieldVisible(
  visibilityMode: VisibilityMode,
  config: SelectiveVisibility,
  field: keyof SelectiveVisibility,
): boolean {
  if (visibilityMode === "share_all") return true;
  if (visibilityMode === "private") return false;
  return config[field];
}

const PreviewFooter = () => (
  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0F2854] py-2.5">
    <Eye className="w-3.5 h-3.5 shrink-0" />
    <span>Only visible information is shown to others</span>
  </div>
);

export default function ProfilePrivacy({
  profile,
  visibilityMode,
  selectiveConfig,
}: ProfileCardProps) {
  const {
    appUser,
    generation,
    skills = [],
    currentStatus,
    socialAccount = [],
    profilePicture,
    bio,
    major,
    cvResumeUrl,
    education = [],
  } = profile;

  const displayName = `${appUser.firstName || ""} ${appUser.lastName || ""}`.trim();
  const username = appUser.username?.includes("@")
    ? appUser.username.split("@")[0]
    : appUser.username || "user";
  const initials = getInitials(appUser.firstName || "", appUser.lastName || "");
  const avatarUrl = profilePicture ? getMediaUrl(profilePicture) : null;

  const show = (field: keyof SelectiveVisibility) =>
    isFieldVisible(visibilityMode, selectiveConfig, field);

  const linkedinAccount = socialAccount.find((s) => s.platform === "linkedin" && s.url?.trim());
  const githubAccount = socialAccount.find((s) => s.platform === "github" && s.url?.trim());
  const facebookAccount = socialAccount.find((s) => s.platform === "facebook" && s.url?.trim());
  const telegramAccount = socialAccount.find((s) => s.platform === "telegram" && s.url?.trim());

  const hasAnySocials =
    show("showSocial") &&
    !!(linkedinAccount || githubAccount || facebookAccount || telegramAccount);

  const coverIndex = useMemo(() => {
    const hash = (appUser.username || "user")
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % 3) + 1;
  }, [appUser.username]);

  if (visibilityMode === "private") {
    return (
      <div className="flex flex-col gap-2">
        <div className="w-full bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-primary/5">
            <p className="text-sm font-bold text-secondary">Preview As Public</p>
          </div>

          <div className="h-28 relative">
            <img
              src={`/covers/cover${coverIndex}.jpg`}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/covers/cover1.jpg";
              }}
            />
          </div>

          <div className="flex flex-col items-center px-5 pb-6">
            <div className="w-20 h-20 rounded-full border-[3px] border-card overflow-hidden bg-primary/10 shadow-sm flex items-center justify-center shrink-0 -mt-10 relative z-10">
              <span className="text-xl font-bold text-primary">{initials}</span>
            </div>

            <div className="text-center w-full mt-3">
              <h3 className="font-bold text-primary text-base leading-tight tracking-tight">
                {displayName}
              </h3>
              <p className="text-xs text-secondary mt-0.5 mb-5">@{username}</p>

              <div className="border border-border/60 py-3 px-4 rounded-xl">
                <span className="text-grey-400 text-xs">
                  {displayName}&apos;s profile is locked
                </span>
              </div>
            </div>
          </div>
        </div>

        <PreviewFooter />
      </div>
    );
  }

  const hasAnyPersonalInfo =
    show("showEmail") ||
    show("showBirthdate") ||
    show("showPhoneNumber") ||
    show("showGender") ||
    show("showGeneration") ||
    show("showCurrentStatus") ||
    show("showMajor") ||
    show("showSkills") ||
    show("showEducation") ||
    show("showCv");

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-primary/5">
          <p className="text-sm font-bold text-secondary">Preview As Public</p>
        </div>

        <div className="h-28 relative">
          <img
            src={`/covers/cover${coverIndex}.jpg`}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/covers/cover1.jpg";
            }}
          />
        </div>

        <div className="flex flex-col items-center px-5 pb-5">
          <div className="w-20 h-20 rounded-full border-[3px] border-card overflow-hidden bg-primary/10 shadow-sm flex items-center justify-center shrink-0 -mt-10 relative z-10">
            {show("showProfilePicture") && avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">{initials}</span>
            )}
          </div>

          <div className="text-center w-full mt-3">
            <h3 className="font-bold text-primary text-base leading-tight tracking-tight">
              {displayName}
            </h3>
            <p className="text-xs text-secondary mt-0.5">{`@${username}`}</p>
            {show("showBio") && bio && (
              <p className="text-xs text-secondary leading-relaxed italic mt-2 px-2">
                &quot;{bio}&quot;
              </p>
            )}
          </div>

          {hasAnyPersonalInfo && (
            <div className="w-full mt-4 space-y-2.5 text-left border-t border-border/40 pt-4">
              <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">
                Personal Information
              </h4>
              {show("showEmail") && appUser.email && (
                <InfoRow icon={<Mail size={14} />} text={appUser.email} />
              )}
              {show("showBirthdate") && appUser.dateOfBirth && (
                <InfoRow icon={<Cake size={14} />} text={formatDate(appUser.dateOfBirth)} />
              )}
              {show("showGeneration") && generation && (
                <InfoRow icon={<Users size={14} />} text={generation.name} />
              )}
              {show("showMajor") && major && (
                <InfoRow icon={<BookOpen size={14} />} text={major} />
              )}
              {show("showSkills") && skills.length > 0 && (
                <InfoRow icon={<Code size={14} />} text={skills.join(", ")} />
              )}
              {show("showPhoneNumber") && appUser.phoneNumber && (
                <InfoRow icon={<Phone size={14} />} text={appUser.phoneNumber} />
              )}
              {show("showCurrentStatus") && currentStatus && (
                <InfoRow icon={<GraduationCap size={14} />} text={currentStatus} />
              )}
              {show("showGender") && appUser.gender && (
                <InfoRow
                  icon={<GenderIcon gender={appUser.gender} />}
                  text={appUser.gender === "F" ? "Female" : "Male"}
                />
              )}
              {show("showCv") && cvResumeUrl && (
                <InfoRow icon={<FileText size={14} />} text="CV / Resume available" />
              )}
              {show("showEducation") && education.length > 0 && (
                <div className="space-y-2">
                  {education.map((edu, i) => (
                    <InfoRow
                      key={i}
                      icon={<GraduationCap size={14} />}
                      text={`${edu.institutionAbbreviation || edu.institutionName} — ${edu.degree}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {hasAnySocials && (
            <div className="flex gap-2.5 mt-4 w-full border-t border-border/40 pt-4">
              {facebookAccount && (
                <a href={facebookAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="#1877F2" /><path d="M22.5 14H20.5C18.57 14 17 15.57 17 17.5V20H15V22.5H17V28H20.5V22.5H23L23.5 20H20.5V17.5C20.5 17.22 20.72 17 21 17H23.5V14Z" fill="white" /></svg>
                </a>
              )}
              {telegramAccount && (
                <a href={telegramAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="#24A1DE" /><path d="M15.4 14.32L23.89 11.49C27.7 10.22 29.77 12.3 28.51 16.11L25.68 24.6C23.78 30.31 20.66 30.31 18.76 24.6L17.92 22.08L15.4 21.24C9.69 19.34 9.69 16.23 15.4 14.32Z" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.11 21.65L21.69 18.06" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              )}
              {githubAccount && (
                <a href={githubAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="#0F172A" /><path d="M17 27C12 28.5 12 24.5 10 24M24 30V26.13C24.04 25.66 23.97 25.18 23.81 24.73C23.65 24.28 23.39 23.87 23.06 23.52C26.2 23.17 29.5 21.98 29.5 16.52C29.5 15.13 28.96 13.78 28 12.77C28.46 11.55 28.42 10.2 27.91 9C27.91 9 26.73 8.65 24 10.48C21.71 9.86 19.29 9.86 17 10.48C14.27 8.65 13.09 9 13.09 9C12.58 10.2 12.54 11.55 13 12.77C12.03 13.79 11.49 15.15 11.5 16.55C11.5 21.97 14.8 23.16 17.94 23.55C17.61 23.89 17.36 24.3 17.2 24.74C17.03 25.19 16.97 25.66 17 26.13V30" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              )}
              {linkedinAccount && (
                <a href={linkedinAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="20" fill="#1C4D8D" /><path d="M23 25.5H24.5C27.52 25.5 30 23.03 30 20C30 16.98 27.53 14.5 24.5 14.5H23" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 14.5H15.5C12.47 14.5 10 16.97 10 20C10 23.02 12.47 25.5 15.5 25.5H17" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 20H24" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              )}
            </div>
          )}

          {!hasAnyPersonalInfo && !hasAnySocials && (
            <div className="w-full flex items-center justify-center py-6 text-xs text-muted-foreground border-t border-border/40 mt-4">
              No additional information visible
            </div>
          )}
        </div>
      </div>

      <PreviewFooter />
    </div>
  );
}
