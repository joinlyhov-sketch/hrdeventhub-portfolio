import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth";
import { profileService } from "@/service/profile.service";
import HeaderNoProfile from "@/components/dashboard/header/HeaderNoProfile";
import PrivacySettingsClient from "@/components/site/profile/setting/PrivacySettingsClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect("/login");
  }

  const response = await profileService.getProfileMe(session.accessToken);

  if (!response.success || !response.payload) {
    return (
      <main className="flex-1 w-full overflow-x-hidden text-slate-800 z-20">
        <HeaderNoProfile
          titlePrimary="Privacy"
          titleSecondary="Settings"
          description="Manage your profile visibility and control who can see your information and activities."
        />
        <p className="text-center text-destructive mt-20">
          Failed to load profile. Please refresh the page.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full overflow-x-hidden text-slate-800 z-20">
      <HeaderNoProfile
        titlePrimary="Privacy"
        titleSecondary="Settings"
        description="Manage your profile visibility and control who can see your information and activities."
      />
      <div className="w-full max-w-475 mx-auto">
        <PrivacySettingsClient profile={response.payload} />
      </div>
    </main>
  );
}
