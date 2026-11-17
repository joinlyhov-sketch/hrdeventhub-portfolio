"use server";

import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth";
import {
  profileService,
  UpdateIdentityRequest,
} from "@/service/profile.service";
import { revalidatePath, revalidateTag } from "next/cache";
import { UpdateProfileRequest } from "@/types/profile-edit-type";

export async function updateProfileMeAction(payload: UpdateProfileRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("Unauthorized access. Token not found.");
  }

  const result = await profileService.updateProfileMe(
    payload,
    session.accessToken,
  );
  revalidateTag("profile", "max");
  return result;
}

export async function getIdentityMeAction() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("Unauthorized access. Token not found.");
  }

  return await profileService.getIdentityMe(session.accessToken);
}

export async function updateIdentityMeAction(payload: UpdateIdentityRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("Unauthorized access. Token not found.");
  }

  const result = await profileService.updateIdentityMe(
    payload,
    session.accessToken,
  );
  revalidateTag("identity", "max");
  return result;
}

export async function deleteResumeAction() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("Unauthorized access. Token not found.");
  }

  const result = await profileService.deleteResume(session.accessToken);
  revalidateTag("profile", "max");
  revalidatePath("/profile");
  return result;
}
