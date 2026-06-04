"use client";

import React from "react";
import { Eye, Mail, Code, Phone, GraduationCap, Cake, Users } from "lucide-react";
import { UserProfilePayload , SharingMode} from "@/types/profile-types";
import { getMediaUrl } from "@/libs/media";
import type { VisibilityMode, SelectiveVisibility } from "./PrivacySettingsClient";

interface ProfileCardProps {
  profile: UserProfilePayload;
  visibilityMode: VisibilityMode;
  selectiveConfig: SelectiveVisibility;
}

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="type-detail text-grey-900 truncate">{text}</span>
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

export default function ProfilePrivacy({ profile, visibilityMode, selectiveConfig }: ProfileCardProps) {
  const { appUser, profilePicture, generation, skills, currentStatus, socialAccount } = profile;
  const displayName = `${appUser.firstName} ${appUser.lastName}`.trim();
  const username = appUser.username.includes("@")
    ? appUser.username.split("@")[0]
    : appUser.username;
  const initials = getInitials(appUser.firstName, appUser.lastName);
  const avatarUrl = profilePicture ? getMediaUrl(profilePicture) : null;

  const linkedinAccount = socialAccount?.find((s) => s.platform === "linkedin" && s.url?.trim());
  const githubAccount = socialAccount?.find((s) => s.platform === "github" && s.url?.trim());
  const facebookAccount = socialAccount?.find((s) => s.platform === "facebook" && s.url?.trim());
  const telegramAccount = socialAccount?.find((s) => s.platform === "telegram" && s.url?.trim());
  const showAvatar = visibilityMode !== "private" && (visibilityMode === "share_all" || selectiveConfig.profile);
  const showBirthdate = visibilityMode !== "private" && (visibilityMode === "share_all" || selectiveConfig.profile);
  const showEmail = visibilityMode !== "private" && (visibilityMode === "share_all" || selectiveConfig.contactInfo);
  const showPhone = visibilityMode !== "private" && (visibilityMode === "share_all" || selectiveConfig.contactInfo);
  const showStatus = visibilityMode !== "private" && (visibilityMode === "share_all" || selectiveConfig.education);
  const showSocials = visibilityMode !== "private" && (visibilityMode === "share_all" || selectiveConfig.socialAccounts);
  const showGeneration = visibilityMode !== "private";
  if (visibilityMode === "private") {
    return (
      <>
        <div className="card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6 min-h-[800px]">
          <div className="w-full type-subtitle-24 font-bold text-[#0f2d59]">Preview As Public</div>
          <div className="bg-primary w-full rounded-2xl h-[120px] shrink-0" />
          <div className="px-6 pb-6 flex flex-col items-center -mt-16 w-full grow">
            <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-grey-100 shadow-sm mb-4 shrink-0 relative z-10 flex items-center justify-center bg-primary/10">
              <span className="text-2xl font-bold text-primary">{initials}</span>
            </div>
            <div className="text-center w-full mt-2">
              <h3 className="type-title text-primary text-base leading-tight mb-0.5 tracking-tight">
                {displayName}
              </h3>
              <p className="type-subtitle text-secondary font-medium mb-4">@{username}</p>
            </div>
            <div className="w-full px-4 mb-4">
              <div className="border py-2.5 rounded-2xl text-center flex items-center justify-center">
                <span className="text-grey-400 type-subtitle tracking-wide">
                  {displayName}&apos;s profile is Locked
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 type-detail flex items-center justify-center gap-1.5 text-[10px] text-[#0F2854]">
          <Eye className="w-3.5 h-3.5" />
          <span>Only visible information is shown to others</span>
        </div>
      </>
    );
  }

  const hasAnyPersonalInfo = showEmail || showBirthdate || showPhone || showStatus || showGeneration;
  const hasAnySocials = showSocials && (linkedinAccount || githubAccount || facebookAccount || telegramAccount);

  return (
    <>
      <div className="xl:col-span-8 w-full h-full bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div className="w-full type-subtitle-24 font-bold text-[#0f2d59]">Preview As Public</div>

        <div className="h-28 bg-[#1e4e8c] border border-border rounded-2xl shrink-0 relative" />

        <div className="px-4 flex flex-col items-center -mt-16 w-full relative z-10">
          <div className="w-28 h-28 rounded-full border-4 border-card overflow-hidden bg-primary/10 shadow-sm mb-3 flex items-center justify-center shrink-0">
            {showAvatar && avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-primary">{initials}</span>
            )}
          </div>
          <div className="text-center w-full">
            <h3 className="type-title text-primary text-base leading-tight mb-0.5 tracking-tight">
              {displayName}
            </h3>
            <p className="text-[16px] text-secondary mb-3 pb-2.5 border-b border-border">
              @{username}
            </p>
            {profile.bio && (
              <p className="text-xs text-secondary text-center leading-relaxed font-medium px-4 max-w-md mx-auto italic">
                &quot;{profile.bio}&quot;
              </p>
            )}
          </div>
        </div>
        <div className="px-4 flex-1 flex flex-col gap-4">
          {hasAnyPersonalInfo && (
            <div className="w-full space-y-3">
              <h4 className="type-subtitle-24 text-primary mb-2">Personal Information</h4>
              {showEmail && (
                <InfoRow icon={<Mail size={16} />} text={appUser.email} />
              )}
              {showBirthdate && (
                <InfoRow icon={<Cake size={16} />} text={formatDate(appUser.dateOfBirth)} />
              )}
              {showGeneration && generation && (
                <InfoRow icon={<Users size={16} />} text={generation.name} />
              )}
              {skills && skills.length > 0 && (
                <InfoRow icon={<Code size={16} />} text={skills.join(", ")} />
              )}
              {showPhone && (
                <InfoRow icon={<Phone size={16} />} text={appUser.phoneNumber || "—"} />
              )}
              {showStatus && (
                <InfoRow icon={<GraduationCap size={16} />} text={currentStatus || "Studying"} />
              )}
              {appUser.gender && (
                <InfoRow icon={<GenderIcon gender={appUser.gender} />} text={appUser.gender === "F" ? "Female" : "Male"} />
              )}
            </div>
          )}
          {hasAnySocials && (
            <div className="flex gap-3 pt-2">
              {facebookAccount && (
                <a href={facebookAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="#1877F2" />
                    <path d="M22.5 14H20.5C18.57 14 17 15.57 17 17.5V20H15V22.5H17V28H20.5V22.5H23L23.5 20H20.5V17.5C20.5 17.22 20.72 17 21 17H23.5V14Z" fill="white" />
                  </svg>
                </a>
              )}
              {telegramAccount && (
                <a href={telegramAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="#24A1DE" />
                    <path d="M15.4 14.32L23.89 11.49C27.7 10.22 29.77 12.3 28.51 16.11L25.68 24.6C23.78 30.31 20.66 30.31 18.76 24.6L17.92 22.08L15.4 21.24C9.69 19.34 9.69 16.23 15.4 14.32Z" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.11 21.65L21.69 18.06" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
              {githubAccount && (
                <a href={githubAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="#0F172A" />
                    <path d="M17 27C12 28.5 12 24.5 10 24M24 30V26.13C24.04 25.66 23.97 25.18 23.81 24.73C23.65 24.28 23.39 23.87 23.06 23.52C26.2 23.17 29.5 21.98 29.5 16.52C29.5 15.13 28.96 13.78 28 12.77C28.46 11.55 28.42 10.2 27.91 9C27.91 9 26.73 8.65 24 10.48C21.71 9.86 19.29 9.86 17 10.48C14.27 8.65 13.09 9 13.09 9C12.58 10.2 12.54 11.55 13 12.77C12.03 13.79 11.49 15.15 11.5 16.55C11.5 21.97 14.8 23.16 17.94 23.55C17.61 23.89 17.36 24.3 17.2 24.74C17.03 25.19 16.97 25.66 17 26.13V30" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
              {linkedinAccount && (
                <a href={linkedinAccount.url} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 shrink-0">
                  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="#1C4D8D" />
                    <path d="M23 25.5H24.5C27.52 25.5 30 23.03 30 20C30 16.98 27.53 14.5 24.5 14.5H23" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 14.5H15.5C12.47 14.5 10 16.97 10 20C10 23.02 12.47 25.5 15.5 25.5H17" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 20H24" stroke="#F9F9F9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {!hasAnyPersonalInfo && !hasAnySocials && (
            <div className="flex justify-center items-center py-8 text-muted-foreground type-detail">
              No additional information visible
            </div>
          )}
        </div>
      </div>

      <div className="p-3 type-detail flex items-center justify-center gap-1.5 text-[10px] text-[#0F2854]">
        <Eye className="w-3.5 h-3.5" />
        <span>Only visible information is shown to others</span>
      </div>
    </>
  );
}