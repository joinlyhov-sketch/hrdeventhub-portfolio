"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import useSWR from "swr";
import { Poll, PollVoteRequest } from "@/types/poll";
import { pollService } from "@/service/poll.service";

interface UsePollOptions {
  enableWebSocket?: boolean;
  onVoteUpdate?: (poll: Poll) => void;
  onPollClosed?: () => void;
  onError?: (error: Error) => void;
}

export function usePoll(pollId: string, options: UsePollOptions = {}) {
  const {
    enableWebSocket = true,
    onVoteUpdate,
    onPollClosed,
    onError,
  } = options;

  const wsConnectedRef = useRef(false);
  const [isClosingTimerActive, setIsClosingTimerActive] = useState(false);

  const {
    data: poll,
    error,
    isLoading,
    mutate,
  } = useSWR<Poll>(
    pollId ? ["poll", pollId] : null,
    () => pollService.getPoll(pollId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  useEffect(() => {
    if (!enableWebSocket || !pollId || !poll) {
      return;
    }

    const setupConnection = async () => {
      try {
        await pollService.setupWebSocket(pollId, {
          onVoteUpdate: (updatedPoll) => {
           
            mutate(updatedPoll, false);
            onVoteUpdate?.(updatedPoll);
          },
          onPollClosed: () => {
            setIsClosingTimerActive(false);
            pollService.closePollConnection(pollId);
            onPollClosed?.();
          },
          onError: (error) => {
            console.error("Poll WebSocket error:", error);
            onError?.(error);
          },
        });

        wsConnectedRef.current = true;
        setIsClosingTimerActive(true);
      } catch (error) {
        wsConnectedRef.current = false;
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("Failed to setup poll WebSocket:", err);
        onError?.(err);
      }
    };

    setupConnection();

    return () => {
      if (wsConnectedRef.current) {
        pollService.closePollConnection(pollId);
        wsConnectedRef.current = false;
      }
    };
  }, [
    enableWebSocket,
    pollId,
    poll,
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

      try {
        const voteRequest: PollVoteRequest = { optionId };
        const updatedPoll = await pollService.votePoll(pollId, voteRequest);
        mutate(updatedPoll, false);

        return updatedPoll;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        onError?.(err);
        throw err;
      }
    },
    [pollId, mutate, onError],
  );

  const refetch = useCallback(() => {
    return mutate();
  }, [mutate]);

  const isPollOpen = useCallback(() => {
    if (!poll) return false;
    const closingTime = new Date(poll.closingTime).getTime();
    return Date.now() < closingTime;
  }, [poll]);

  const getTimeRemaining = useCallback(() => {
    if (!poll) return null;
    const closingTime = new Date(poll.closingTime).getTime();
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

  return {
    poll,
    isLoading,
    error,
    vote,
    refetch,
    isPollOpen: isPollOpen(),
    getTimeRemaining,
    isWebSocketConnected: wsConnectedRef.current,
    isClosingTimerActive,
  };
}
