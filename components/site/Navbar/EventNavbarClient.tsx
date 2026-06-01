"use client";
import { useParams } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspace";
import EventNavbar from "./EventNavbar";

export default function EventNavbarClient() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { workspace, isLoading } = useWorkspace(groupId);

  return <EventNavbar workspace={workspace} isLoading={isLoading} />;
}