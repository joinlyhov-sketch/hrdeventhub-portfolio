"use server";
import { invitationService } from "@/service/invitation.service";
import { CreateInvitationRequest } from "@/types/invitation";

export async function createInvitationAction(payload: CreateInvitationRequest) {
  return invitationService.create(payload);
}