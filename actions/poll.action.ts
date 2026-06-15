"use server";

import { revalidateTag } from "next/cache";
import { pollService } from "@/service/poll.service";
import { Poll, PollCreateRequest, PollVoteRequest } from "@/types/poll";

export async function getAllPollsAction(
  page: number = 1,
  size: number = 100,
): Promise<Poll[]> {
  return pollService.getAll(page, size);
}

export async function getPollsByWorkspaceAction(
  workspaceId: string,
  page: number = 1,
  size: number = 10,
): Promise<Poll[]> {
  return pollService.getByWorkspace(workspaceId, page, size);
}

export async function getPollAction(pollId: string): Promise<Poll> {
  return pollService.getById(pollId);
}

export async function getPollOptionsAction(pollId: string): Promise<unknown> {
  return pollService.getOptions(pollId);
}

export async function createPollAction(
  request: PollCreateRequest,
): Promise<Poll> {
  const result = await pollService.create(request);
  revalidateTag("polls","max");
  if (request.workspaceId) {
    revalidateTag(`workspace-polls-${request.workspaceId}`,"max");
  }
  return result;
}

export async function updatePollAction(
  pollId: string,
  request: Partial<PollCreateRequest> & { newOptionTexts?: string[] },
): Promise<Poll> {
  const result = await pollService.update(pollId, request);
  revalidateTag("polls","max");
  revalidateTag(`poll-${pollId}`,"max");
  if (request.workspaceId) {
    revalidateTag(`workspace-polls-${request.workspaceId}`,"max");
  }
  return result;
}

export async function votePollAction(
  pollId: string,
  voteRequest: PollVoteRequest,
): Promise<Poll> {
  const result = await pollService.vote(pollId, voteRequest);
  revalidateTag("polls","max");
  revalidateTag(`poll-${pollId}`,"max");
  return result;
}

export async function deletePollAction(
  pollId: string,
  workspaceId?: string,
): Promise<void> {
  await pollService.delete(pollId);
  revalidateTag("polls","max");
  revalidateTag(`poll-${pollId}`,"max");
  if (workspaceId) {
    revalidateTag(`workspace-polls-${workspaceId}`,"max");
  }
}