"use client";
import { useWorkspace } from "@/hooks/use-workspace";
import EventNavbar from "./EventNavbar";

interface EventNavbarClientProps {
  groupId: string;
}

export default function EventNavbarClient({ groupId }: EventNavbarClientProps) {
  const { workspaces, isLoading } = useWorkspace(groupId);

  return <EventNavbar workspace={workspaces} isLoading={isLoading} />;
}