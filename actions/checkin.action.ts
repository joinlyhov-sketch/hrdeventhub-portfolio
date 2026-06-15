"use server";

import { checkinService } from "../service/checkin.service";
import type { CheckInResult, CheckInError } from "@/types/bottom-nav/types";

type CheckInActionResult =
  | { success: true; data: CheckInResult }
  | { success: false; error: CheckInError };

export async function checkInAttendeeAction(
  token: string,
  registrationToken: string,
): Promise<CheckInActionResult> {
  try {
    const res = await checkinService.verifyAttendeeTicket(registrationToken, token);
    return {
      success: true,
      data: {
        attendeeName: res.payload.attendeeName,
        eventName: res.payload.postTitle,
        registeredAt: res.payload.checkedInAt,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: {
        message:
          err instanceof Error
            ? err.message
            : "Network error. Please check your connection.",
      },
    };
  }
}