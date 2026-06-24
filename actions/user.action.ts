"use server";

import { userService } from "@/service/user.service";
import { UserData } from "@/types/user-management-type/user";
import { revalidateTag } from "next/cache";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function getAllUsersAction(): Promise<UserData[]> {
  try {
    const rawUsers = await userService.getAll();

    return rawUsers.map((u) => ({
      ...u,
      no: u.appUserId,
      status: u.active ? "Active" : "Suspended",
      gen: u.generation?.name || "N/A",
      phone: u.phoneNumber,
    }));
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function suspendUserAction(userId: string, reason: string) {
  try {
    const result = await userService.suspend(userId, { reason });
    revalidateTag("users", "max");
    return result;
  } catch (error: unknown) {
    console.error("Server Action Mutation Failure [suspendUserAction]:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to suspend account."),
    };
  }
}

export async function reactivateUserAction(userId: string) {
  try {
    const result = await userService.reactivate(userId);
    revalidateTag("users", "max");
    return result;
  } catch (error: unknown) {
    console.error(
      "Server Action Mutation Failure [reactivateUserAction]:",
      error,
    );
    return {
      success: false,
      message: getErrorMessage(error, "Failed to reactivate account."),
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
  } catch (error: unknown) {
    console.error(
      "Server Action Mutation Failure [updateUserRoleAction]:",
      error,
    );
    return {
      success: false,
      message: getErrorMessage(error, "Failed to update role."),
    };
  }
}

export async function getUserByIdAction(userId: string) {
  try {
    const result = await userService.getUserById(userId);
    return result;
  } catch (error: unknown) {
    console.error("Server Action Failure [getUserByIdAction]:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch user."),
    };
  }
}
