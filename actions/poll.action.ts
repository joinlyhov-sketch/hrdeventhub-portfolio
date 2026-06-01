"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Poll, PollVoteRequest, PollCreateRequest } from "@/types/poll";
import { apiGet, apiPost, apiPatch } from "@/libs/api";

async function getAuthToken(): Promise<string | undefined> {
  const session = await getServerSession(authOptions);
  return session?.accessToken || (session?.user as any)?.token;
}

function formatShowResult(value: string | undefined): string {
  if (!value) return "always";

  const cleanValue = value.toLowerCase().trim();

  if (cleanValue.includes("always")) return "always";
  if (cleanValue.includes("voting") || cleanValue.includes("aftervote"))
    return "after_vote";
  if (cleanValue.includes("expire") || cleanValue.includes("close"))
    return "after_close";

  return "always";
}

export async function getPollAction(pollId: string): Promise<Poll> {
  const authToken = await getAuthToken();
  return apiGet<Poll>(`/polls/${pollId}`, { authToken });
}

export async function votePollAction(
  pollId: string,
  voteRequest: PollVoteRequest,
): Promise<Poll> {
  const authToken = await getAuthToken();
  return apiPost<Poll, PollVoteRequest>(`/polls/${pollId}/vote`, voteRequest, {
    authToken,
  });
}

export async function getPollOptionsAction(pollId: string): Promise<any> {
  const authToken = await getAuthToken();
  return apiGet<any>(`/polls/${pollId}/options`, { authToken });
}

export async function createPollAction(
  request: PollCreateRequest,
): Promise<Poll> {
  if (!request.title || !request.title.trim())
    throw new Error("Poll title is required");
  if (!request.options || request.options.length < 2)
    throw new Error("Poll must have at least 2 options");
  if (!request.closingTime) throw new Error("Closing time is required");

  const closingTime = new Date(request.closingTime).getTime();
  if (closingTime <= Date.now())
    throw new Error("Closing time must be in the future");
  if (!request.workspaceId) throw new Error("Workspace ID is required");

  const authToken = await getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  const optionsArray = request.options.map((opt) =>
    typeof opt === "string" ? opt : opt.text,
  );

  const payload = {
    workspaceId: request.workspaceId,
    title: request.title.trim(),
    description: request.description?.trim() || "",
    type: request.type || "text",
    options: optionsArray,
    closingTime: request.closingTime,
    multiSelect: request.multiSelect ?? false,
    anonymousVoting: request.anonymousVoting ?? false,
    allowAddOptions: request.allowAddOptions ?? false,
    hiddenPoll: request.hiddenPoll ?? false,
    showResult: formatShowResult(request.showResult),
  };

  return apiPost<Poll, typeof payload>("/polls", payload, { authToken });
}

export async function updatePollAction(
  pollId: string,
  request: Partial<PollCreateRequest>,
): Promise<Poll> {
  if (!pollId) throw new Error("Poll ID is required");

  if (request.closingTime) {
    const closingTime = new Date(request.closingTime).getTime();
    if (closingTime <= Date.now())
      throw new Error("Closing time must be in the future");
  }

  const authToken = await getAuthToken();
  if (!authToken) throw new Error("Authentication required");

  const payload: any = {};

  if (request.title !== undefined) payload.title = request.title.trim();
  if (request.description !== undefined)
    payload.description = request.description.trim();
  if (request.closingTime !== undefined)
    payload.closingTime = request.closingTime;

  if (request.options !== undefined) {
    if (request.options.length < 2)
      throw new Error("Poll must have at least 2 options");
    payload.options = request.options.map((opt) => ({
      text: typeof opt === "string" ? opt : opt.text,
    }));
  }

  if (request.showResult !== undefined) {
    payload.showResult = formatShowResult(request.showResult);
  }

  return apiPatch<Poll, typeof payload>(`/polls/${pollId}`, payload, {
    authToken,
  });
}
