"use server";
import { invitationService } from "@/service/invitation.service";
import { CreateInvitationRequest } from "@/types/invitation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function createInvitationAction(payload: CreateInvitationRequest) {
  return invitationService.create(payload);
}

export async function getInvitationPreviewAction(inviteToken: string) {
  return invitationService.getPreview(inviteToken);
}

export async function joinInvitationAction(inviteToken: string) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) throw new Error("Not authenticated");
  return invitationService.join(inviteToken, accessToken);
}