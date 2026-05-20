import AdminProfileForm from "../../../../components/site/profile/edit-profile/AdminProfileForm";
import StudentProfileForm from "../../../../components/site/profile/edit-profile/StudentProfileForm";
import HeaderProfileEdit from "../../../../components/site/profile/edit-profile/HeaderProfileEdit";

type Role = "admin" | "organizer" | "student";

type CurrentUser = {
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
};

const MOCK_CURRENT_USER: CurrentUser = {
  name: "Dita Rector",
  email: "RectorDita@gmail.com",
  role: "student",
  avatarInitials: "DR",
};

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
    <div className="w-full min-w-0 transition-all duration-300 py-4">
      <div className="w-full min-w-0 block">
        <div className="mb-6">
          <h1 className="type-title text-secondary">
            {currentUser.role === "student"
              ? <HeaderProfileEdit />
              : "Edit Profile"}
          </h1>
        </div>
        <div className="w-full min-w-0 flex flex-col">
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