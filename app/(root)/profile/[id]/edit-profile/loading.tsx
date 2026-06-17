import HeaderNoProfile from "@/components/dashboard/header/HeaderNoProfile";
import EditProfileSkeleton from "@/components/site/profile/edit-profile/EditProfileSkeleton";

export default function Loading() {
  return (
    <main className="flex-1 w-full overflow-x-hidden text-slate-800 z-20">
      <HeaderNoProfile
        titlePrimary="Privacy"
        titleSecondary="Settings"
        description="Manage your profile visibility and control who can see your information and activities."
      />
      <div className="w-full max-w-475 mx-auto">
        <EditProfileSkeleton />
      </div>
    </main>
  );
}