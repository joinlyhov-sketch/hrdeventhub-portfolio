"use client";
import ProfileHeader from "../../../components/site/profile/ProfileHeader";
import BackgroundTab from "../../../components/site/profile/BackgroundTab";
import EventTab from "../../../components/site/profile/EventTab";
import { useState } from "react";
import ProfileCard from "../../../components/site/profile/ProfileCard";
import EndorsementTabs from "../../../components/site/profile/EndorsementTabs";
import HeaderNoProfile from "../../../components/dashboard/header/HeaderNoProfile";

export type UserViewMode = "ADMIN" | "STUDENT_SELF" | "ALUMNI_VIEWING_STUDENT";

export default function ProfilePage() {
  const viewMode = 'STUDENT_SELF' as UserViewMode; 
  
  const [activeTab, setActiveTab] = useState<'BG' | 'EV' | 'EN'>('BG');
  const showStudentTabs = viewMode === 'STUDENT_SELF' || viewMode === 'ALUMNI_VIEWING_STUDENT';

  return (
    <div className='flex-1 overflow-y-auto bg-background min-h-screen flex flex-col gap-4  '>
      <HeaderNoProfile
        titlePrimary="My"
        titleSecondary="Profile"
        description="View your profile information, background details, and endorsements from participated events."
      />
      <div className="lg:pr-12 lg:pl-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start ">
        <div className="xl:col-span-4">
          <ProfileCard viewMode={viewMode} />
        </div>
        <div className="xl:col-span-8 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex bg-muted p-1.5 rounded-lg border border-border gap-1">
            <Tabnav
              active={activeTab === "BG"}
              label="Background"
              onClick={() => setActiveTab("BG")}
            />

            {showStudentTabs && (
              <>
                <Tabnav
                  active={activeTab === "EV"}
                  label="Participated Event"
                  onClick={() => setActiveTab("EV")}
                />
                <Tabnav
                  active={activeTab === "EN"}
                  label="My Endorsement"
                  onClick={() => setActiveTab("EN")}
                />
              </>
            )}
          </div>
          <div className="w-full">
            {activeTab === "BG" && <BackgroundTab />}
            {activeTab === "EV" && showStudentTabs && <EventTab />}
            {activeTab === "EN" && showStudentTabs && <EndorsementTabs />}
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
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-grey-50 hover:text-foreground"
    }`}
  >
    {label}
  </button>
);
