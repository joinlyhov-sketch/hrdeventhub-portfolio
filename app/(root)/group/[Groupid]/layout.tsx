import EventNavbar from "../../../../components/site/Navbar/EventNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="w-full sticky top-0 z-20">
        <EventNavbar />
      </div>
      <main className="min-h-full flex mt-6 flex-col max-w-full pr-8 lg:pr-12 lg:pl-12 z-10">
        {children}
      </main>
    </div>
  );
}
