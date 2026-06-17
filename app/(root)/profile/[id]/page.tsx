"use client";

import BackgroundTab from "@/components/site/profile/BackgroundTab";
import EventTab from "@/components/site/profile/EventTab";
import { useState, useEffect } from "react";
import ProfileCard from "@/components/site/profile/ProfileCard";
import EndorsementTabs from "@/components/site/profile/EndorsementTabs";
import ProfileHeader from "@/components/site/profile/ProfileHeader";
import { useCurrentUser } from "@/context/user-context";
import { useSession } from "next-auth/react";
import { profileService } from "@/service/profile.service";
import { UserProfilePayload } from "@/types/profile-types";
import { useParams } from "next/navigation";
import ProfilePageSkeleton from "@/components/site/profile/ProfilePageSkeleton";

export type ViewMode = "self" | "alumni" | "admin" | "organizer" | "student";

export default function ProfilePage() {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<UserProfilePayload | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const [isPublicView, setIsPublicView] = useState(false);

  const isReady = sessionStatus === "authenticated" && !userLoading;
  const isSelf = isReady && currentUser?.id === userId;

  const viewMode: ViewMode = !isReady
    ? "student"
    : isSelf
      ? "self"
      : ((currentUser?.role as ViewMode) ?? "student");

  useEffect(() => {
    if (!isReady || !session?.accessToken) return;

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = isSelf
          ? await profileService.getProfileMe(session.accessToken!)
          : await profileService.getProfileById(userId, session.accessToken!);
        if (res.success) setProfile(res.payload);
      } catch (e) {
        console.error("Profile fetch failed:", e);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [isReady, session?.accessToken, userId]);

  const subjectRole = profile?.roles ? String(profile.roles).toUpperCase() : "";
  const viewerRole = currentUser?.role
    ? String(currentUser.role).toUpperCase()
    : "";

  const sharingMode = profile?.profileSharingMode;
  const isPrivate = sharingMode === "PRIVATE";

  const hideTabsDueToPrivacy = isPrivate && (!isSelf || isPublicView);

  const showEventTab =
    !hideTabsDueToPrivacy &&
    isReady &&
    viewerRole !== "" &&
    subjectRole !== "" &&
    ((isSelf && (viewerRole === "STUDENT" || viewerRole === "ALUMNI")) ||
      (!isSelf && (subjectRole === "STUDENT" || subjectRole === "ALUMNI")));

  const showEndorsementTab =
    !hideTabsDueToPrivacy &&
    isReady &&
    !isSelf &&
    viewerRole === "ALUMNI" &&
    subjectRole === "STUDENT";

  const titlePrimary = isSelf
    ? "My"
    : subjectRole === "ALUMNI"
      ? "Alumni"
      : subjectRole === "ADMIN"
        ? "Admin"
        : subjectRole === "ORGANIZER"
          ? "Organizer"
          : "Student";

  const [activeTab, setActiveTab] = useState<"BG" | "EV" | "EN">("BG");

  useEffect(() => {
    if (activeTab === "EV" && !showEventTab)
      queueMicrotask(() => setActiveTab("BG"));
    if (activeTab === "EN" && !showEndorsementTab)
      queueMicrotask(() => setActiveTab("BG"));
  }, [activeTab, showEventTab, showEndorsementTab]);

  const subjectName = profile
    ? `${profile.appUser.firstName} ${profile.appUser.lastName}`.trim()
    : undefined;

  const headerDesc = !isReady
    ? "Please wait..."
    : isSelf
      ? "View your profile information, background details, and endorsements."
      : `You are viewing ${subjectName ?? "this user"}'s profile.`;

  const isSubjectAdmin = subjectRole === "ADMIN";
  const adjustedViewMode = isSelf
    ? "self"
    : viewerRole === "ADMIN"
      ? "student"
      : viewMode;

  if (!isReady || profileLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="w-full bg-background z-30">
      <ProfileHeader description={headerDesc} titlePrimary={titlePrimary} />
      <div className="w-full max-w-475 px-4 sm:px-6 lg:pr-12 lg:pl-12 mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start ">
          <div className="xl:col-span-4 xl:h-full xl:overflow-y-auto">
            <ProfileCard
              viewMode={
                !isReady ? null : isSelf ? "self" : isSubjectAdmin ? "student" : adjustedViewMode
              }
              profile={profile}
              loading={profileLoading || !isReady}
              profileId={userId}
              authToken={session?.accessToken ?? ""}
              isPublicView={isPublicView}
              setIsPublicView={setIsPublicView}
            />
          </div>
          <div className="xl:col-span-8 xl:h-full bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-6 xl:overflow-hidden">
            <div className="flex bg-muted p-1.5 rounded-xl border border-border gap-1 shrink-0 overflow-x-auto">
              <Tabnav
                active={activeTab === "BG"}
                label="Background"
                onClick={() => setActiveTab("BG")}
              />
              {showEventTab && (
                <Tabnav
                  active={activeTab === "EV"}
                  label="Participated Event"
                  onClick={() => setActiveTab("EV")}
                />
              )}
              {showEndorsementTab && (
                <Tabnav
                  active={activeTab === "EN"}
                  label={isSelf ? "My Endorsement" : "Endorsements"}
                  onClick={() => setActiveTab("EN")}
                />
              )}
            </div>
            <div className="w-full flex-1 min-h-0 xl:overflow-hidden">
              {activeTab === "BG" && (
                <BackgroundTab
                  profile={profile}
                  loading={profileLoading || !isReady}
                  viewMode={!isReady ? null : isSelf ? "self" : isSubjectAdmin ? "student" : adjustedViewMode}
                  isPublicView={isPublicView}
                />
              )}
              {activeTab === "EV" && showEventTab && (
                <EventTab userId={userId} />
              )}
              {activeTab === "EN" && showEndorsementTab && (
                <EndorsementTabs studentId={isSelf ? undefined : userId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Tabnav = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 shrink-0 whitespace-nowrap py-2.5 px-4 rounded-lg type-desc-semibold transition-all duration-100 ${
      active
        ? "bg-primary text-primary-foreground shadow-sm cursor-pointer"
        : "text-muted-foreground hover:bg-grey-50 hover:text-foreground cursor-pointer"
    }`}
  >
    {label}
  </button>
);