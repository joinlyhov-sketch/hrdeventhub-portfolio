"use client";
import AdminProfileForm from "@/components/site/profile/edit-profile/AdminProfileForm";
import StudentProfileForm from "@/components/site/profile/edit-profile/StudentProfileForm";
import HeaderNoProfile from "@/components/dashboard/header/HeaderNoProfile";
import { useCurrentUser } from "@/context/user-context";

export default function ProfilePage() {
  const { currentUser } = useCurrentUser();

  return (
    <div className="w-full min-w-0 transition-all duration-300 z-20">
      <div className="w-full min-w-0 block">
        <HeaderNoProfile
          titlePrimary="Edit"
          titleSecondary="Profile"
          description="Update your profile information and manage your account settings."
        />
        <div className="max-w-420 m-auto w-full min-w-0 flex flex-col lg:pr-12 lg:pl-12">
          {currentUser?.role === "student" ? (
            <StudentProfileForm />
          ) : (
            <AdminProfileForm user={currentUser} />
          )}
        </div>
      </div>
    </div>
  );
}