"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/libs/utils";

export function MobileContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isChatRoute = pathname.startsWith("/chat");
  const isMobileChatOpen = isChatRoute && !!searchParams.get("target");

  return (
    <div
      className={cn(
        "flex flex-col flex-1",
        !isMobileChatOpen && "pt-14 md:pt-0 pb-12",
      )}
    >
      {children}
    </div>
  );
}