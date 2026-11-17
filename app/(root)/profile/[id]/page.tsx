import ProfilePageClient from "@/components/site/profile/ProfilePageClient";
import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import { profileService } from "@/service/profile.service";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "student" || session?.user?.role === "alumni") {
    try {
      const res = await profileService.getProfileById(id, session.accessToken as string);
      if (!res.success) {
        redirect("/group");
      }
    } catch (err) {
      redirect("/group");
    }
  }

  return <ProfilePageClient userId={id} />;
}