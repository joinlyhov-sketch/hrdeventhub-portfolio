"use client";
import { useSession } from "next-auth/react";
import { useWorkspace } from "@/hooks/use-workspace";
import EventNavbar from "./EventNavbar";

interface EventNavbarClientProps {
  groupId: string;
}

export default function EventNavbarClient({ groupId }: EventNavbarClientProps) {
  const { data: session } = useSession();
  const { workspace, isLoading } = useWorkspace(groupId);

  console.log("groupId:", groupId);
  console.log("token:", session?.accessToken);

  return <EventNavbar workspace={workspace} isLoading={isLoading} />;
}