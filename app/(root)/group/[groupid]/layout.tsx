import EventNavbarClient from "@/components/site/Navbar/EventNavbarClient";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupid: string }>;
}) {
  const { groupid } = await params;

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="w-full sticky top-0 z-20">
        <EventNavbarClient groupId={groupid} />
      </div>
      <main className="min-h-full flex mt-4 sm:mt-6 flex-col w-full max-w-475 mx-auto px-4 sm:px-6 lg:pr-12 lg:pl-12 z-10">
        {children}
      </main>
    </div>
  );
}
