"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/context/user-context";
import { profileService } from "@/service/profile.service";
import { UserProfilePayload } from "@/types/profile-types";
import ProfileHeader from "@/components/site/profile/ProfileHeader";
import ProfileCard from "@/components/site/profile/ProfileCard";
import ProfileTabsContainer from "./ProfileTabsContainer";
import ProfilePageSkeleton from "@/components/site/profile/ProfilePageSkeleton";

export type ViewMode = "self" | "alumni" | "admin" | "organizer" | "student";

interface ProfilePageClientProps {
  userId: string;
}

export default function ProfilePageClient({ userId }: ProfilePageClientProps) {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: session, status: sessionStatus } = useSession();

  const [profile, setProfile] = useState<UserProfilePayload | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isPublicView, setIsPublicView] = useState(false);

  const isReady = sessionStatus === "authenticated" && !userLoading;
  const isSelf = isReady && currentUser?.id === userId;

  const viewMode: ViewMode = !isReady
    ? "student"
    : isSelf
      ? "self"
      : ((currentUser?.role?.toLowerCase() as ViewMode) ?? "student");

  useEffect(() => {
    if (!isReady || !session?.accessToken) return;

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = isSelf
          ? await profileService.getProfileMe(session.accessToken!)
          : await profileService.getProfileById(userId, session.accessToken!);

        if (res.success) {
          setProfile(res.payload);
        }
      } catch (e) {
        console.error("Profile fetch failed:", e);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [isReady, session?.accessToken, userId, isSelf]);

  if (!isReady || profileLoading) {
    return <ProfilePageSkeleton />;
  }

  const subjectRole = profile?.roles ? String(profile.roles).toUpperCase() : "";
  const viewerRole = currentUser?.role ? String(currentUser.role).toUpperCase() : "";
  const isSubjectAdmin = subjectRole === "ADMIN";

  const adjustedViewMode = isSelf
    ? "self"
    : viewerRole === "ADMIN"
      ? "student"
      : viewMode;

  const titlePrimary = isSelf
    ? "My"
    : subjectRole === "ALUMNI"
      ? "Alumni"
      : subjectRole === "ADMIN"
        ? "Admin"
        : subjectRole === "ORGANIZER"
          ? "Organizer"
          : "Student";

  const subjectName = profile
    ? `${profile.appUser.firstName} ${profile.appUser.lastName}`.trim()
    : undefined;

  const headerDesc = isSelf
    ? "View your profile information, background details, and endorsements."
    : `You are viewing ${subjectName ?? "this user"}'s profile.`;

  const calculatedViewMode = isSelf
    ? "self"
    : isSubjectAdmin
      ? "student"
      : adjustedViewMode;

  return (
    <div className="w-full bg-background z-30 ">
      <ProfileHeader description={headerDesc} titlePrimary={titlePrimary} />

      <div className="w-full max-w-475 px-4 sm:px-6 lg:pr-12 lg:pl-12 mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="xl:col-span-4 xl:h-full xl:overflow-y-auto">
            <ProfileCard
              viewMode={calculatedViewMode}
              profile={profile}
              loading={profileLoading}
              profileId={userId}
              authToken={session?.accessToken ?? ""}
              isPublicView={isPublicView}
              setIsPublicView={setIsPublicView}
            />
          </div>

          <div className="xl:col-span-8 xl:h-full bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-6 xl:overflow-hidden">
            <ProfileTabsContainer
              profile={profile}
              userId={userId}
              isSelf={isSelf}
              isReady={isReady}
              viewerRole={viewerRole}
              subjectRole={subjectRole}
              isPublicView={isPublicView}
              calculatedViewMode={calculatedViewMode}
              profileLoading={profileLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}