"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { Poll, PollVoteRequest } from "@/types/poll";
import { pollService } from "@/service/poll.service";

interface UsePollOptions {
  enableWebSocket?: boolean;
  onVoteUpdate?: (poll: Poll) => void;
  onPollClosed?: () => void;
  onError?: (error: Error) => void;
}

type StoredVote = {
  pollId: string;
  optionIds: string[];
  votedAt: string;
};

function getVoteStorageKey(pollId: string) {
  return `hrd-eventhub-poll-vote-${pollId}`;
}

function getStoredVote(pollId: string): StoredVote | null {
  if (typeof window === "undefined" || !pollId) {
    return null;
  }

  try {
    const rawVote = window.localStorage.getItem(getVoteStorageKey(pollId));
    return rawVote ? (JSON.parse(rawVote) as StoredVote) : null;
  } catch {
    return null;
  }
}

function saveStoredVote(pollId: string, optionIds: string[]) {
  if (typeof window === "undefined" || !pollId) {
    return;
  }

  const vote: StoredVote = {
    pollId,
    optionIds,
    votedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(getVoteStorageKey(pollId), JSON.stringify(vote));
}

function getPollSelectedOptionIds(poll: Poll | undefined): string[] {
  if (!poll) return [];

  const data = poll as any;

  if (Array.isArray(data.selectedOptionIds)) {
    return data.selectedOptionIds;
  }

  if (Array.isArray(data.votedOptionIds)) {
    return data.votedOptionIds;
  }

  if (Array.isArray(data.optionIds)) {
    return data.optionIds;
  }

  if (Array.isArray(data.userVote?.optionIds)) {
    return data.userVote.optionIds;
  }

  if (Array.isArray(data.myVote?.optionIds)) {
    return data.myVote.optionIds;
  }

  if (Array.isArray(data.votedOptions)) {
    return data.votedOptions
      .map((option: any) => option.id ?? option.optionId)
      .filter(Boolean);
  }

  return [];
}

function getTotalVotes(poll: Poll | undefined): number {
  if (!poll) return 0;

  const directTotal = Number((poll as any).totalVotes);

  if (!Number.isNaN(directTotal) && directTotal > 0) {
    return directTotal;
  }

  return poll.options.reduce((total, option) => {
    return total + Number(option.voteCount ?? 0);
  }, 0);
}

function recalculatePercentages(poll: Poll): Poll {
  const totalVotes = getTotalVotes(poll);

  return {
    ...poll,
    totalVotes,
    options: poll.options.map((option) => {
      const voteCount = Number(option.voteCount ?? 0);

      return {
        ...option,
        voteCount,
        percentage:
          totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0,
      };
    }),
  };
}

function createOptimisticPoll(poll: Poll, optionIds: string[]): Poll {
  const previousSelectedIds = getPollSelectedOptionIds(poll);
  const previousSelectedSet = new Set(previousSelectedIds);
  const nextSelectedSet = new Set(optionIds);

  const options = poll.options.map((option) => {
    const wasSelected = previousSelectedSet.has(option.id);
    const isSelected = nextSelectedSet.has(option.id);

    let voteCount = Number(option.voteCount ?? 0);

    if (!wasSelected && isSelected) {
      voteCount += 1;
    }

    if (wasSelected && !isSelected && voteCount > 0) {
      voteCount -= 1;
    }

    return {
      ...option,
      voteCount,
    };
  });

  return recalculatePercentages({
    ...poll,
    options,
    hasVoted: true,
    selectedOptionIds: optionIds,
    votedOptionIds: optionIds,
  });
}

function isAlreadyVotedError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error ?? "");

  return message.toLowerCase().includes("already voted");
}

export function usePoll(pollId: string, options: UsePollOptions = {}) {
  const {
    enableWebSocket = true,
    onVoteUpdate,
    onPollClosed,
    onError,
  } = options;

  const wsConnectedRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [storedSelectedOptionIds, setStoredSelectedOptionIds] = useState<
    string[]
  >([]);
  const [isClosingTimerActive, setIsClosingTimerActive] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [animatingOptionIds, setAnimatingOptionIds] = useState<string[]>([]);

  const {
    data: poll,
    error,
    isLoading,
    mutate,
  } = useSWR<Poll>(
    pollId ? ["poll", pollId] : null,
    () => pollService.getById(pollId).then(recalculatePercentages),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      refreshInterval: enableWebSocket ? 0 : 5000,
    }
  );

  useEffect(() => {
    if (!pollId) {
      setStoredSelectedOptionIds([]);
      return;
    }

    const storedVote = getStoredVote(pollId);
    setStoredSelectedOptionIds(storedVote?.optionIds ?? []);
  }, [pollId]);

  const selectedOptionIds = useMemo(() => {
    const serverSelectedIds = getPollSelectedOptionIds(poll);

    if (serverSelectedIds.length > 0) {
      return serverSelectedIds;
    }

    return storedSelectedOptionIds;
  }, [poll, storedSelectedOptionIds]);

  const hasVoted = useMemo(() => {
    return selectedOptionIds.length > 0 || Boolean((poll as any)?.hasVoted);
  }, [selectedOptionIds, poll]);

  useEffect(() => {
    if (!enableWebSocket || !pollId) {
      return;
    }

    let isMounted = true;

    const connect = async () => {
      try {
        await pollService.setupWebSocket(pollId, {
          onVoteUpdate: (updatedPoll) => {
            if (!isMounted) return;

            const nextPoll = recalculatePercentages(updatedPoll);
            mutate(nextPoll, false);
            onVoteUpdate?.(nextPoll);
          },

          onPollClosed: () => {
            if (!isMounted) return;

            setIsClosingTimerActive(false);
            pollService.closePollConnection(pollId);
            onPollClosed?.();
          },

          onError: (socketError) => {
            if (!isMounted) return;

            wsConnectedRef.current = false;
            onError?.(socketError);

            if (reconnectTimerRef.current) {
              clearTimeout(reconnectTimerRef.current);
            }

            reconnectTimerRef.current = setTimeout(() => {
              if (isMounted) {
                connect();
              }
            }, 3000);
          },
        });

        if (!isMounted) return;

        wsConnectedRef.current = true;
        setIsClosingTimerActive(true);
      } catch (socketError) {
        if (!isMounted) return;

        wsConnectedRef.current = false;

        const err =
          socketError instanceof Error
            ? socketError
            : new Error(String(socketError));

        onError?.(err);

        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
        }

        reconnectTimerRef.current = setTimeout(() => {
          if (isMounted) {
            connect();
          }
        }, 3000);
      }
    };

    connect();

    return () => {
      isMounted = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      pollService.closePollConnection(pollId);
      wsConnectedRef.current = false;
      setIsClosingTimerActive(false);
    };
  }, [
    enableWebSocket,
    pollId,
    mutate,
    onVoteUpdate,
    onPollClosed,
    onError,
  ]);

  const vote = useCallback(
    async (optionId: string) => {
      if (!pollId) {
        throw new Error("Poll ID is required");
      }

      if (!optionId) {
        throw new Error("Option ID is required");
      }

      if (!poll) {
        throw new Error("Poll is not loaded yet");
      }

      const alreadyVoted =
        selectedOptionIds.length > 0 || Boolean((poll as any)?.hasVoted);

      if (alreadyVoted) {
        setAnimatingOptionIds(selectedOptionIds);

        setTimeout(() => {
          setAnimatingOptionIds([]);
        }, 700);

        return poll;
      }

      try {
        setIsVoting(true);
        setAnimatingOptionIds([optionId]);

        const optionIds = poll.multiSelect
          ? selectedOptionIds.includes(optionId)
            ? selectedOptionIds.filter((id) => id !== optionId)
            : [...selectedOptionIds, optionId]
          : [optionId];

        if (optionIds.length === 0) {
          throw new Error("At least one option must be selected");
        }

        const optimisticPoll = createOptimisticPoll(poll, optionIds);

        await mutate(optimisticPoll, false);

        const voteRequest: PollVoteRequest = {
          optionIds,
        };

        const updatedPoll = await pollService.vote(pollId, voteRequest);

        const nextPoll = recalculatePercentages({
          ...updatedPoll,
          hasVoted: true,
          selectedOptionIds: optionIds,
          votedOptionIds: optionIds,
        });

        saveStoredVote(pollId, optionIds);
        setStoredSelectedOptionIds(optionIds);

        await mutate(nextPoll, false);

        setTimeout(() => {
          setAnimatingOptionIds([]);
        }, 700);

        return nextPoll;
      } catch (voteError) {
        if (isAlreadyVotedError(voteError)) {
          saveStoredVote(pollId, [optionId]);
          setStoredSelectedOptionIds([optionId]);

          const votedPoll = recalculatePercentages({
            ...poll,
            hasVoted: true,
            selectedOptionIds: [optionId],
            votedOptionIds: [optionId],
          });

          await mutate(votedPoll, false);

          setTimeout(() => {
            setAnimatingOptionIds([]);
          }, 700);

          return votedPoll;
        }

        await mutate();

        const err =
          voteError instanceof Error
            ? voteError
            : new Error(String(voteError));

        onError?.(err);
        throw err;
      } finally {
        setIsVoting(false);
      }
    },
    [pollId, poll, selectedOptionIds, mutate, onError]
  );

  const voteMultiple = useCallback(
    async (optionIds: string[]) => {
      if (!pollId) {
        throw new Error("Poll ID is required");
      }

      if (!poll) {
        throw new Error("Poll is not loaded yet");
      }

      if (!optionIds.length) {
        throw new Error("At least one option ID is required");
      }

      const alreadyVoted =
        selectedOptionIds.length > 0 || Boolean((poll as any)?.hasVoted);

      if (alreadyVoted) {
        setAnimatingOptionIds(selectedOptionIds);

        setTimeout(() => {
          setAnimatingOptionIds([]);
        }, 700);

        return poll;
      }

      try {
        setIsVoting(true);
        setAnimatingOptionIds(optionIds);

        const optimisticPoll = createOptimisticPoll(poll, optionIds);
        await mutate(optimisticPoll, false);

        const voteRequest: PollVoteRequest = {
          optionIds,
        };

        const updatedPoll = await pollService.vote(pollId, voteRequest);

        const nextPoll = recalculatePercentages({
          ...updatedPoll,
          hasVoted: true,
          selectedOptionIds: optionIds,
          votedOptionIds: optionIds,
        });

        saveStoredVote(pollId, optionIds);
        setStoredSelectedOptionIds(optionIds);

        await mutate(nextPoll, false);

        setTimeout(() => {
          setAnimatingOptionIds([]);
        }, 700);

        return nextPoll;
      } catch (voteError) {
        if (isAlreadyVotedError(voteError)) {
          saveStoredVote(pollId, optionIds);
          setStoredSelectedOptionIds(optionIds);

          const votedPoll = recalculatePercentages({
            ...poll,
            hasVoted: true,
            selectedOptionIds: optionIds,
            votedOptionIds: optionIds,
          });

          await mutate(votedPoll, false);

          setTimeout(() => {
            setAnimatingOptionIds([]);
          }, 700);

          return votedPoll;
        }

        await mutate();

        const err =
          voteError instanceof Error
            ? voteError
            : new Error(String(voteError));

        onError?.(err);
        throw err;
      } finally {
        setIsVoting(false);
      }
    },
    [pollId, poll, selectedOptionIds, mutate, onError]
  );

  const refetch = useCallback(() => {
    return mutate();
  }, [mutate]);

  const isPollOpen = useCallback(() => {
    if (!poll?.closingTime) return false;

    const closingTime = new Date(poll.closingTime).getTime();

    if (Number.isNaN(closingTime)) return false;

    return Date.now() < closingTime;
  }, [poll]);

  const getTimeRemaining = useCallback(() => {
    if (!poll?.closingTime) return null;

    const closingTime = new Date(poll.closingTime).getTime();

    if (Number.isNaN(closingTime)) return null;

    const timeRemaining = closingTime - Date.now();

    if (timeRemaining <= 0) {
      return null;
    }

    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / 1000 / 60 / 60) % 24);
    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

    return {
      milliseconds: timeRemaining,
      seconds,
      minutes,
      hours,
      days,
    };
  }, [poll]);

  const totalVotes = getTotalVotes(poll);

  return {
    poll,
    isLoading,
    error,

    vote,
    voteMultiple,
    refetch,

    hasVoted,
    selectedOptionIds,
    votedOptionIds: selectedOptionIds,

    totalVotes,
    isVoting,
    animatingOptionIds,

    isPollOpen: isPollOpen(),
    getTimeRemaining,

    isWebSocketConnected: wsConnectedRef.current,
    isClosingTimerActive,
  };
}