"use server";

import { userService } from "@/service/user.service";
import { revalidateTag } from "next/cache";

export async function getAllUsersAction() {
  try {
    return await userService.getAll();
  } catch (error) {
    console.error("Server Action Fetch Error [getAllUsersAction]:", error);
    return [];
  }
}

export async function suspendUserAction(userId: string, reason: string) {
  try {
    const result = await userService.suspend(userId, { reason });
    revalidateTag("users", "max");
    return result;
  } catch (error: any) {
    console.error("Server Action Mutation Failure [suspendUserAction]:", error);
    return {
      success: false,
      message: error.message || "Failed to suspend account.",
    };
  }
}

export async function reactivateUserAction(userId: string) {
  try {
    const result = await userService.reactivate(userId);
    revalidateTag("users", "max");
    return result;
  } catch (error: any) {
    console.error(
      "Server Action Mutation Failure [reactivateUserAction]:",
      error,
    );
    return {
      success: false,
      message: error.message || "Failed to reactivate account.",
    };
  }
}

export async function updateUserRoleAction(
  userId: string,
  role: "ADMIN" | "ORGANIZER" | "ALUMNI" | "STUDENT",
) {
  try {
    const result = await userService.updateRole(userId, { role });
    revalidateTag("users", "max");
    return result;
  } catch (error: any) {
    console.error(
      "Server Action Mutation Failure [updateUserRoleAction]:",
      error,
    );
    return {
      success: false,
      message: error.message || "Failed to update role.",
    };
  }
}
