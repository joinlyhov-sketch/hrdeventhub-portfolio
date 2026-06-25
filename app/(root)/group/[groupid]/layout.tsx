import EventNavbarClient from "@/components/site/Navbar/EventNavbarClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import { workspaceService } from "@/service/workspace.service";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupid: string }>;
}) {
  const { groupid } = await params;

  const session = await getServerSession(authOptions);
  
  if (session?.user?.role === "student" || session?.user?.role === "alumni") {
    try {
      const workspaces = await workspaceService.getMyWorkspaces(session.accessToken);
      const isMember = workspaces.some((w) => w.workspaceId === groupid);
      if (!isMember) {
        redirect("/group");
      }
    } catch (err) {
      redirect("/group");
    }
  }

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="w-full sticky top-[55px] md:top-0 z-20">
        <EventNavbarClient groupId={groupid} />
      </div>
      <main className="min-h-full flex mt-4 sm:mt-6 flex-col w-full max-w-475 mx-auto px-4 sm:px-6 lg:pr-12 lg:pl-12 z-10">
        {children}
      </main>
    </div>
  );
}
