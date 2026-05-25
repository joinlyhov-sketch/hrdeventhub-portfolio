import AdminProfileForm from "../../../../components/site/profile/edit-profile/AdminProfileForm";
import StudentProfileForm from "../../../../components/site/profile/edit-profile/StudentProfileForm";
import HeaderNoProfile from "../../../../components/dashboard/header/HeaderNoProfile";
import {
  MOCK_CURRENT_USER,
  type CurrentUser,
} from "../../../../data/mock-user";

export default async function ProfilePage() {
  const currentUser: CurrentUser | null = MOCK_CURRENT_USER;

  if (!currentUser) {
    return (
      <div className="w-full min-h-screen bg-grey-50 flex items-center justify-center p-4">
        <p className="type-desc text-grey-500 animate-pulse">
          Loading profile records...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 transition-all duration-300">
      <div className="w-full min-w-0 block">
        <HeaderNoProfile
          titlePrimary="Edit"
          titleSecondary="Profile"
          description="Update your profile information and manage your account settings."
        />
        <div className="max-w-7xl m-auto w-full min-w-0 flex flex-col lg:pr-12 lg:pl-12">
          {currentUser.role === "student" ? (
            <StudentProfileForm />
          ) : (
            <AdminProfileForm user={currentUser} />
          )}
        </div>
      </div>
    </div>
  );
}
