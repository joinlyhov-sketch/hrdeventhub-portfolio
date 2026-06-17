import { apiPost, apiPatch } from "@/libs/api";

export interface PresenceRecord {
  appUserId: string;
  status: "ONLINE" | "OFFLINE";
  label: string;
}

export interface PresenceResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Record<string, PresenceRecord>;
  timestamp: string;
}

export type PresenceMap = Record<string, PresenceRecord>;

export async function queryPresence(
  userIds: string[],
  token: string,
): Promise<PresenceMap> {
  if (userIds.length === 0) return {};

  const response = await apiPost<PresenceResponse>("/presence/query", userIds, {
    authToken: token,
  });

  return response.payload;
}

export async function setPresenceOnline(token: string): Promise<void> {
  await apiPatch("/presence/me/online", undefined, { authToken: token });
}

export async function setPresenceOffline(token: string): Promise<void> {
  await apiPatch("/presence/me/offline", undefined, { authToken: token });
}
