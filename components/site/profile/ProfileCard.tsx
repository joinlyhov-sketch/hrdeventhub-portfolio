"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Mail,
  Calendar,
  Users,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { UserProfilePayload } from "@/types/profile-types";
import { getMediaUrl } from "@/libs/media";
import EndorseStudentModal from "../pop-up/EndorseStep";
import { getPresenceAction } from "@/actions/presence.action";
import { PresenceMap } from "@/service/presence.service";
import type { ViewMode } from "@/app/(root)/profile/[id]/page";
import { useRouter } from "next/navigation";

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 w-full min-w-0">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="text-grey-900 truncate grow" title={text}>
      {text}
    </span>
  </div>
);

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
  isPublicView: boolean;
  setIsPublicView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileCard({
  viewMode,
  profile,
  loading,
  profileId,
  authToken,
  isPublicView,
  setIsPublicView,
}: ProfileCardProps) {
  const [isEndorseOpen, setIsEndorseOpen] = useState(false);
  const [presenceMap, setPresenceMap] = useState<PresenceMap>({});
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!profile?.appUser.appUserId) return;
    const fetchPresence = () => {
      getPresenceAction([profile.appUser.appUserId])
        .then(setPresenceMap)
        .catch(() => {});
    };
    fetchPresence();
    const interval = setInterval(fetchPresence, 30_000);
    return () => clearInterval(interval);
  }, [profile?.appUser.appUserId]);

  const isOnline = profile?.appUser.appUserId
    ? presenceMap[profile.appUser.appUserId]?.status === "ONLINE"
    : false;

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

  const displayName =
    `${profile.appUser.firstName} ${profile.appUser.lastName}`.trim();
  const profileAvatar = getMediaUrl(profile.profilePicture);
  const showEdit = viewMode === "self";
  const showEndorse = viewMode === "alumni" && profile.roles === "STUDENT"; 
  const showMessage = viewMode !== "self" && viewMode !== null;

  const coverIndex = useMemo(() => {
    const hash = (profile.appUser.username || "user")
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % 9) + 1;
  }, [profile.appUser.username]);

  const sharingMode = profile.profileSharingMode;
  const prefs = profile.preferences;

  const isVisible = (field: keyof NonNullable<typeof prefs>): boolean => {
    if (showEdit && !isPublicView) return true;
    if (sharingMode === "PUBLIC") return true;
    if (sharingMode === "PRIVATE") return false;
    return prefs?.[field] ?? true;
  };

  const showLockedState = isPublicView && sharingMode === "PRIVATE";

  const GenderIcon = ({ gender }: { gender: string }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {gender === "F" ? (
        <>
          <path
            d="M7.6875 16.125C10.8977 16.125 13.5 13.5227 13.5 10.3125C13.5 7.10234 10.8977 4.5 7.6875 4.5C4.47734 4.5 1.875 7.10234 1.875 10.3125C1.875 13.5227 4.47734 16.125 7.6875 16.125Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.125 1.875L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.25 1.875H16.125V6.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M10.5 7.5C10.5 9.98528 8.48528 12 6 12C3.51472 12 1.5 9.98528 1.5 7.5C1.5 5.01472 3.51472 3 6 3C8.48528 3 10.5 5.01472 10.5 7.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 1.5L11.25 6.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 1.5H16.5V4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full w-full">
      <div className="h-48 w-full rounded-xl shrink-0 relative overflow-hidden">
        <img
          src={`/covers/cover${coverIndex}.jpg`}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/covers/cover1.jpg";
          }}
        />
      </div>
      <div className="px-6 pb-6 flex flex-col items-center -mt-16 w-full grow">
        <div className="relative z-20 w-32 h-32 mb-4 shrink-0">
          <div
            className={`w-full h-full rounded-full border-4 border-card overflow-hidden bg-grey-100 shadow-sm flex items-center justify-center select-none ${
              profileAvatar && isVisible("showProfilePicture")
                ? "cursor-pointer"
                : "cursor-default"
            }`}
            onClick={() =>
              profileAvatar &&
              isVisible("showProfilePicture") &&
              setIsAvatarOpen(true)
            }
          >
            {isVisible("showProfilePicture") && profileAvatar ? (
              <Image
                src={profileAvatar}
                alt={displayName}
                width={128}
                height={128}
                unoptimized
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
          {isOnline && (
            <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-card z-30" />
          )}
          {isAvatarOpen && profileAvatar && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
              onClick={() => setIsAvatarOpen(false)}
            >
              <div
                className="relative max-w-sm w-full mx-4 bg-white rounded-2xl shadow-xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsAvatarOpen(false)}
                  className="absolute -top-3 -right-3 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-grey-500 hover:text-grey-900 transition-colors cursor-pointer text-sm"
                >
                  ✕
                </button>
                <img
                  src={profileAvatar}
                  alt={displayName}
                  className="w-full rounded-xl object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-center w-full px-2">
          <h2 className="type-title text-primary font-bold text-xl">
            {displayName}
          </h2>
          <p className="text-detail text-secondary mb-4 border-b pb-2.5 border-border">
            @{profile.appUser.username.split("@")[0]}
          </p>
          {isVisible("showBio") && profile.bio && (
            <p className="text-detail font-medium text-secondary mb-2 leading-relaxed italic">
              &quot;{profile.bio}&quot;
            </p>
          )}
        </div>

        <div className="w-full space-y-3 pt-3 text-left">
          {showLockedState ? (
            <div className="w-full pt-6">
              <div className="border py-2.5 rounded-2xl text-center flex items-center justify-center">
                <span className="text-grey-400 type-desc tracking-wide">
                  {displayName}&apos;s profile is locked
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-3 text-left">
              <h3 className="type-subtitle-24 text-secondary font-semibold mb-4">
                Personal Information
              </h3>
              {isVisible("showEmail") && profile.appUser.email && (
                <InfoRow
                  icon={<Mail size={16} />}
                  text={profile.appUser.email}
                />
              )}
              {isVisible("showBirthdate") && profile.appUser.dateOfBirth && (
                <InfoRow
                  icon={<Calendar size={16} />}
                  text={formatDate(profile.appUser.dateOfBirth)}
                />
              )}
              {isVisible("showGeneration") && profile.generation?.name && (
                <InfoRow
                  icon={<Users size={16} />}
                  text={profile.generation.name}
                />
              )}
              {isVisible("showMajor") && profile.major && (
                <InfoRow icon={<BookOpen size={16} />} text={profile.major} />
              )}
              {isVisible("showPhoneNumber") && profile.appUser.phoneNumber && (
                <InfoRow
                  icon={<Phone size={16} />}
                  text={profile.appUser.phoneNumber}
                />
              )}
              {isVisible("showGender") && profile.appUser.gender && (
                <InfoRow
                  icon={<GenderIcon gender={profile.appUser.gender} />}
                  text={profile.appUser.gender === "F" ? "Female" : "Male"}
                />
              )}
              {isVisible("showCurrentStatus") && profile.currentStatus && (
                <InfoRow
                  icon={<BriefcaseBusiness size={16} />}
                  text={profile.currentStatus
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                />
              )}
              {isVisible("showEducation") && profile.education?.length > 0 && (
                <InfoRow
                  icon={<GraduationCap size={18} />}
                  text={profile.education
                    .map((e) => e.institutionAbbreviation || e.institutionName)
                    .join(", ")}
                />
              )}
            </div>
          )}
        </div>

        <div className="grow w-full min-h-5" />

        <div className="w-full mt-4 flex flex-col gap-3">
          {showEdit && (
            <>
              <button
                onClick={() => setIsPublicView((v) => !v)}
                className="w-full border border-primary text-primary py-3 rounded-lg type-desc-semibold hover:bg-primary/5 transition-colors font-medium cursor-pointer text-center"
              >
                {isPublicView ? "Back to My View" : "Preview Public View"}
              </button>
              {!isPublicView && (
                <Link
                  href={`/profile/${profileId}/edit-profile`}
                  className="block w-full"
                >
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer text-center">
                    Edit Profile
                  </button>
                </Link>
              )}
            </>
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
            <button
              onClick={() =>
                router.push(`/chat?userId=${profile.appUser.appUserId}`)
              }
              className="w-full flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3 rounded-md type-desc-semibold hover:bg-muted transition-colors font-medium cursor-pointer"
            >
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