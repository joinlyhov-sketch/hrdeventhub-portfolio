"use client";

import { DEMO_MODE, demoSession } from "@/libs/demo/config";
import { DemoToolbar } from "@/components/demo-toolbar";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={DEMO_MODE ? demoSession : undefined} refetchInterval={0} refetchOnWindowFocus={false}>{children}{DEMO_MODE && <DemoToolbar />}</SessionProvider>
  );
}
