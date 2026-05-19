export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex mt-6 flex-col max-w-full pr-8 lg:pr-12 lg:pl-12">
      <main>
        {children}
      </main>
    </div>
  );
}
