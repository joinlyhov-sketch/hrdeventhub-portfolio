"use client";

import React, { useState } from "react";
import {
  Mail,
  Calendar,
  Users,
  Code,
  Phone,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { UserProfilePayload } from "@/types/profile-types";
import { getMediaUrl } from "@/libs/media";
import EndorseStudentModal from "../pop-up/EndorseStep";
import type { ViewMode } from "@/app/(root)/profile/[id]/page";

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 w-full min-w-0">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="text-grey-900 truncate grow" title={text}>
      {text}
    </span>
  </div>
);

const formatSkills = (skills: string[]): string => {
  if (!skills || skills.length === 0) return "N/A";
  return skills.join(", ");
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getInitials = (firstName: string, lastName: string): string => {
  const fInitial = firstName?.trim() ? firstName.trim().charAt(0) : "";
  const lInitial = lastName?.trim() ? lastName.trim().charAt(0) : "";
  return `${fInitial}${lInitial}`.toUpperCase();
};

interface ProfileCardProps {
  viewMode: ViewMode | null;
  profile: UserProfilePayload | null;
  loading: boolean;
  profileId: string;
  authToken: string;
}

export default function ProfileCard({
  viewMode,
  profile,
  loading,
  profileId,
  authToken,
}: ProfileCardProps) {
  const [isEndorseOpen, setIsEndorseOpen] = useState(false);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm flex items-center justify-center h-96 w-full">
        <p className="text-muted-foreground animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm flex items-center justify-center h-96 w-full">
        <p className="text-destructive">Failed to load profile.</p>
      </div>
    );
  }

  const sharingMode = profile.profileSharingMode;
  const prefs = profile.preferences?.[0];

  const isVisible = (field: keyof NonNullable<typeof prefs>): boolean => {
    if (sharingMode === "PUBLIC") return true;
    if (sharingMode === "PRIVATE") return false;
    return prefs?.[field] ?? true;
  };

  const displayName =
    `${profile.appUser.firstName} ${profile.appUser.lastName}`.trim();
  const profileAvatar = getMediaUrl(profile.profilePicture);
  const linkedinAccount = profile.socialAccount?.find(
    (s: any) => s.platform === "linkedin" && s.url?.trim(),
  );
  const githubAccount = profile.socialAccount?.find(
    (s: any) => s.platform === "github" && s.url?.trim(),
  );
  const facebookAccount = profile.socialAccount?.find(
    (s: any) => s.platform === "facebook" && s.url?.trim(),
  );
  const telegramAccount = profile.socialAccount?.find(
    (s: any) => s.platform === "telegram" && s.url?.trim(),
  );

  const showEdit = viewMode === "self";
  const showEndorse =
    viewMode === "alumni" || viewMode === "organizer";
  const showMessage = viewMode !== "self";

  console.log("preferences:", profile.preferences);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full w-full overflow-hidden">
      <div className="h-32 bg-primary w-full rounded-xl shrink-0" />
      <div className="px-6 pb-6 flex flex-col items-center -mt-16 w-full grow justify-between">
        <div className="w-full flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-grey-100 shadow-sm mb-4 shrink-0 relative z-10 flex items-center justify-center select-none">
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-3xl tracking-wider">
                {getInitials(
                  profile.appUser.firstName,
                  profile.appUser.lastName,
                )}
              </span>
            )}
          </div>
          <div className="text-center w-full px-2">
            <h2 className="type-title text-primary font-bold text-xl">
              {displayName}
            </h2>
            <p className="text-[20px] text-secondary mb-4 border-b pb-2.5 border-border">
              @{profile.appUser.username.split("@")[0]}
            </p>
            <p className="type-desc text-secondary mb-2 leading-relaxed italic">
              {profile.bio ? `"${profile.bio}"` : "No bio provided yet."}
            </p>
          </div>

          <div className="w-full space-y-3 pt-6 text-left">
            <h3 className="type-subtitle-24 text-secondary font-semibold mb-4">
              Personal Information
            </h3>
            <InfoRow icon={<Mail size={16} />} text={profile.appUser.email} />
            <InfoRow
              icon={<Calendar size={16} />}
              text={formatDate(profile.appUser.dateOfBirth)}
            />
            <InfoRow
              icon={<Users size={16} />}
              text={profile.generation?.name || "N/A"}
            />
            <InfoRow
              icon={<Code size={16} />}
              text={formatSkills(profile.skills)}
            />
            <InfoRow
              icon={<Phone size={16} />}
              text={profile.appUser.phoneNumber ? `+855${profile.appUser.phoneNumber}` : "—"}
            />
            <InfoRow
              icon={<GraduationCap size={16} />}
              text={
                profile.currentStatus
                  ? profile.currentStatus
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())
                    : "Studying"
                }
              />
          </div>

          {(facebookAccount ||
            telegramAccount ||
            githubAccount ||
            linkedinAccount) && (
            <div className="w-full flex items-center gap-4 pt-6 justify-start">
              {facebookAccount && (
                <a
                  href={facebookAccount.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 shrink-0"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="20" fill="#1877F2" />
                    <path
                      d="M22.5 14H20.5C18.57 14 17 15.57 17 17.5V20H15V22.5H17V28H20.5V22.5H23L23.5 20H20.5V17.5C20.5 17.22 20.72 17 21 17H23.5V14Z"
                      fill="white"
                    />
                  </svg>
                </a>
              )}
              {telegramAccount && (
                <a
                  href={telegramAccount.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 shrink-0"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="20" fill="#24A1DE" />
                    <path
                      d="M15.3997 14.3202L23.8897 11.4902C27.6997 10.2202 29.7697 12.3002 28.5097 16.1102L25.6797 24.6002C23.7797 30.3102 20.6597 30.3102 18.7597 24.6002L17.9197 22.0802L15.3997 21.2402C9.68969 19.3402 9.68969 16.2302 15.3997 14.3202Z"
                      stroke="#F9F9F9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.1094 21.6525L21.6894 18.0625"
                      stroke="#F9F9F9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
              {githubAccount && (
                <a
                  href={githubAccount.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 shrink-0"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="20" fill="#0F172A" />
                    <path
                      d="M17 27.0034C12 28.5034 12 24.5034 10 24.0034M24 30.0034V26.1334C24.0375 25.6565 23.9731 25.1772 23.811 24.7271C23.6489 24.2771 23.3929 23.8668 23.06 23.5234C26.2 23.1734 29.5 21.9834 29.5 16.5234C29.4997 15.1272 28.9627 13.7846 28 12.7734C28.4559 11.5519 28.4236 10.2017 27.91 9.00336C27.91 9.00336 26.73 8.65336 24 10.4834C21.708 9.86218 19.292 9.86218 17 10.4834C14.27 8.65336 13.09 9.00336 13.09 9.00336C12.5764 10.2017 12.5441 11.5519 13 12.7734C12.0301 13.7921 11.4925 15.1468 11.5 16.5534C11.5 21.9734 14.8 23.1634 17.94 23.5534C17.611 23.8933 17.3573 24.2988 17.1953 24.7433C17.0334 25.1878 16.9668 25.6614 17 26.1334V30.0034"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
              {linkedinAccount && (
                <a
                  href={linkedinAccount.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 shrink-0"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="20" fill="#1C4D8D" />
                    <path
                      d="M22.9883 25.5H24.4983C27.5183 25.5 29.9983 23.03 29.9983 20C29.9983 16.98 27.5283 14.5 24.4983 14.5H22.9883"
                      stroke="#F9F9F9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 14.5H15.5C12.47 14.5 10 16.97 10 20C10 23.02 12.47 25.5 15.5 25.5H17"
                      stroke="#F9F9F9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 20H24"
                      stroke="#F9F9F9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        <div className="grow w-full min-h-[20px]" />

        <div className="w-full mt-6 flex flex-col gap-3">
          {showEdit && (
            <Link
              href={`/profile/${profileId}/edit-profile`}
              className="block w-full"
            >
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer text-center">
                Edit Profile
              </button>
            </Link>
          )}

          {showEndorse && (
            <button
              onClick={() => setIsEndorseOpen(true)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer"
            >
              Endorse
            </button>
          )}

          {showMessage && (
            <button className="w-full flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3 rounded-md type-desc-semibold hover:bg-muted transition-colors font-medium cursor-pointer">
              <MessageCircle size={16} />
              Message
            </button>
          )}
        </div>
      </div>
      {showEndorse && (
        <EndorseStudentModal
          isOpen={isEndorseOpen}
          onClose={() => setIsEndorseOpen(false)}
          studentId={profileId}
          authToken={authToken}
          studentName={displayName}
          studentAvatar={profileAvatar || undefined}
          onSuccess={() => setIsEndorseOpen(false)}
        />
      )}
    </div>
  );
}