"use client";

import { useState, useEffect } from "react";
import BackgroundTab from "@/components/site/profile/BackgroundTab";
import EventTab from "@/components/site/profile/EventTab";
import EndorsementTabs from "@/components/site/profile/EndorsementTabs";
import { UserProfilePayload } from "@/types/profile-types";

interface ProfileTabsContainerProps {
  profile: UserProfilePayload | null;
  userId: string;
  isSelf: boolean;
  isReady: boolean;
  viewerRole: string;
  subjectRole: string;
  isPublicView: boolean;
  calculatedViewMode: string | null;
  profileLoading: boolean;
}

export default function ProfileTabsContainer({
  profile,
  userId,
  isSelf,
  isReady,
  viewerRole,
  subjectRole,
  isPublicView,
  calculatedViewMode,
  profileLoading,
}: ProfileTabsContainerProps) {
  const [activeTab, setActiveTab] = useState<"BG" | "EV" | "EN">("BG");

  const isPrivate = profile?.profileSharingMode === "PRIVATE";
  const hideTabsDueToPrivacy = isPrivate && (!isSelf || isPublicView);

  const isStudentSelf = isSelf && viewerRole === "STUDENT";
  const isAlumniSelf = isSelf && viewerRole === "ALUMNI";

  const showEventTab =
    !hideTabsDueToPrivacy &&
    isReady &&
    viewerRole !== "" &&
    subjectRole !== "" &&
    (isStudentSelf || isAlumniSelf || (!isSelf && (subjectRole === "STUDENT" || subjectRole === "ALUMNI")));

  const showEndorsementTab =
    !hideTabsDueToPrivacy &&
    isReady &&
    viewerRole !== "" &&
    subjectRole !== "" &&
    (isStudentSelf || (!isSelf && viewerRole === "ALUMNI" && subjectRole === "STUDENT"));

  useEffect(() => {
    if (activeTab === "EV" && !showEventTab) setActiveTab("BG");
    if (activeTab === "EN" && !showEndorsementTab) setActiveTab("BG");
  }, [activeTab, showEventTab, showEndorsementTab]);

  return (
    <>
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
            viewMode={calculatedViewMode}
            isPublicView={isPublicView}
          />
        )}

        {activeTab === "EV" && showEventTab && <EventTab userId={userId} />}

        {activeTab === "EN" && showEndorsementTab && (
          <EndorsementTabs studentId={isSelf ? undefined : userId} />
        )}
      </div>
    </>
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