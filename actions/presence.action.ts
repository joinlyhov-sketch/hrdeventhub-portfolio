"use server";

import {
  queryPresence,
  setPresenceOnline,
  setPresenceOffline,
  PresenceMap,
} from "@/service/presence.service";
import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth"; 

export async function getPresenceAction(
  userIds: string[],
): Promise<PresenceMap> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string;
    return await queryPresence(userIds, token);
  } catch (error) {
    console.error("[getPresenceAction] Failed:", error);
    return {};
  }
}

export async function setOnlineAction(): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string;
    await setPresenceOnline(token);
  } catch (error) {
    console.error("[setOnlineAction] Failed:", error);
  }
}

export async function setOfflineAction(): Promise<void> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string;
    await setPresenceOffline(token);
  } catch (error) {
    console.error("[setOfflineAction] Failed:", error);
  }
}
