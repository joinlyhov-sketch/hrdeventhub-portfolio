"use client";

import React, { useState, useEffect } from "react";
import { usePoll } from "@/hooks/use-poll";

interface PollComponentProps {
  pollId: string;
  enableRealTime?: boolean;
}

export function PollComponent({
  pollId,
  enableRealTime = true,
}: PollComponentProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const {
    poll,
    isLoading,
    error,
    vote,
    refetch,
    isPollOpen,
    getTimeRemaining,
    isWebSocketConnected,
  } = usePoll(pollId, {
    enableWebSocket: enableRealTime,
    onVoteUpdate: (updatedPoll) => {
      console.log("Poll updated with new votes:", updatedPoll);
      setMessage("New vote received!");
      setTimeout(() => setMessage(""), 3000);
    },
    onPollClosed: () => {
      console.log("Poll has closed");
      setMessage("This poll has closed.");
    },
    onError: (error) => {
      console.error("Poll error:", error);
      setMessage(`Error: ${error.message}`);
    },
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      if (remaining) {
        const { days, hours, minutes, seconds } = remaining;
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${seconds}s`);
        }
      } else {
        setTimeRemaining("Poll closed");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  const handleVote = async (optionId: string) => {
    if (!isPollOpen) {
      setMessage("Poll is no longer open for voting");
      return;
    }

    setIsVoting(true);
    setSelectedOption(optionId);

    try {
      await vote(optionId);
      setMessage("Vote submitted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        `Failed to submit vote: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading poll...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  if (!poll) {
    return <div className="p-4">Poll not found</div>;
  }

  const totalVotes = poll.totalVotes || 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{poll.title}</h2>
          <div className="text-sm font-semibold">
            <span className={isPollOpen ? "text-green-600" : "text-red-600"}>
              {isPollOpen ? "Open" : "Closed"}
            </span>
            {timeRemaining && (
              <div className="text-xs text-gray-500 mt-1">{timeRemaining}</div>
            )}
          </div>
        </div>

        {poll.description && (
          <p className="text-gray-600">{poll.description}</p>
        )}

        {enableRealTime && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                isWebSocketConnected ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            <span className="text-gray-600">
              {isWebSocketConnected
                ? "Live updates enabled"
                : "Disconnected - updates paused"}
            </span>
          </div>
        )}
      </div>
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
          {message}
        </div>
      )}
      {isPollOpen ? (
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage =
              totalVotes > 0
                ? Math.round((option.voteCount / totalVotes) * 100)
                : 0;

            return (
              <button
                key={option.optionId}
                onClick={() => handleVote(option.optionId)}
                disabled={isVoting || !isPollOpen}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  selectedOption === option.optionId
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  isVoting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {option.text}
                  </span>
                  <span className="text-sm text-gray-600">
                    {option.voteCount} vote{option.voteCount !== 1 ? "s" : ""} (
                    {percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </button>
            );
          })}

          <div className="mt-4 text-sm text-gray-600 text-center">
            Total votes: {totalVotes}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          <p>This poll is now closed and no longer accepting votes.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
          >
            Refresh Results
          </button>
        </div>
      )}
    </div>
  );
}
