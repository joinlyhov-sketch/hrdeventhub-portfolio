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

export type ViewMode = "self" | "alumni" | "admin" | "organizer" | "student";

export default function ProfilePage() {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<UserProfilePayload | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const isReady = sessionStatus === "authenticated" && !userLoading;
  const isSelf = isReady && currentUser?.id === userId;

  const viewMode: ViewMode = !isReady
    ? "student"
    : isSelf
      ? "self"
      : ((currentUser?.role as ViewMode) ?? "student");

  const showTabs =
    isSelf || profile?.roles === "STUDENT" || profile?.roles === "ALUMNI";

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
  }, [isReady, session?.accessToken, userId, isSelf]);

  const subjectRole = profile?.roles;

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

  const subjectName = profile
    ? `${profile.appUser.firstName} ${profile.appUser.lastName}`.trim()
    : undefined;

  const headerDesc = !isReady
    ? "Please wait..."
    : isSelf
      ? "View your profile information, background details, and endorsements."
      : `You are viewing ${subjectName ?? "this user"}'s profile.`;

  return (
    <div className="w-full bg-background z-30">
      <ProfileHeader description={headerDesc} titlePrimary={titlePrimary} />
      <div className="lg:pr-12 lg:pl-12 max-w-420 m-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch max-h-[calc(100vh-220px)] xl:h-[680px]">
          <div className="xl:col-span-4 h-full">
            <ProfileCard
              viewMode={!isReady ? null : viewMode}
              profile={profile}
              loading={profileLoading || !isReady}
              profileId={userId}
              authToken={session?.accessToken ?? ""}
            />
          </div>
          <div className="xl:col-span-8 h-full bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 overflow-hidden">
            <div className="flex bg-muted p-1.5 rounded-lg border border-border gap-1 shrink-0">
              <Tabnav
                active={activeTab === "BG"}
                label="Background"
                onClick={() => setActiveTab("BG")}
              />
              {showTabs && (
                <>
                  <Tabnav
                    active={activeTab === "EV"}
                    label="Participated Event"
                    onClick={() => setActiveTab("EV")}
                  />
                  <Tabnav
                    active={activeTab === "EN"}
                    label={isSelf ? "My Endorsement" : "Endorsements"}
                    onClick={() => setActiveTab("EN")}
                  />
                </>
              )}
            </div>
            <div className="w-full flex-1 min-h-0 overflow-hidden">
              {activeTab === "BG" && (
                <BackgroundTab
                  profile={profile}
                  loading={profileLoading || !isReady}
                />
              )}

              {activeTab === "EV" && showTabs && (
                <EventTab userId={isSelf ? undefined : userId} />
              )}

              {activeTab === "EN" && showTabs && (
                <EndorsementTabs
                  studentId={isSelf ? undefined : userId}
                  authToken={session?.accessToken ?? ""}
                />
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
    className={`flex-1 py-2.5 px-4 rounded-md type-desc-semibold transition-all duration-100 ${
      active
        ? "bg-primary text-primary-foreground shadow-sm cursor-pointer"
        : "text-muted-foreground hover:bg-grey-50 hover:text-foreground cursor-pointer"
    }`}
  >
    {label}
  </button>
);
