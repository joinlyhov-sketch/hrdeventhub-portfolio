"use client";

import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import useSWR from "swr";
import type { UserRole } from "@/context/user-context";
import EditPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import { Poll } from "@/types/poll";
import { useSession } from "next-auth/react";
import { pollService } from "@/service/poll.service";
import { deletePollAction } from "@/actions/poll.action";
import { formatEventDate } from "@/libs/format-date";

interface PollCardProps {
  role: UserRole;
  polls: Poll[];
  searchQuery: string;
  onDeletePoll: (pollId: string) => void;
}

function PollItem({
  initialPoll,
  role,
  onDelete,
}: {
  initialPoll: Poll;
  role: UserRole;
  onDelete: () => void;
}) {
  const { data: session } = useSession();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [localVoted, setLocalVoted] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [previouslyVotedOptionIds, setPreviouslyVotedOptionIds] = useState<
    Set<string>
  >(new Set());
  const [votedTypeSnapshot, setVotedTypeSnapshot] = useState<string | null>(
    null,
  );
  const [votedOptionsCountSnapshot, setVotedOptionsCountSnapshot] = useState<
    number | null
  >(null);
  const [persistedVoteCounts, setPersistedVoteCounts] = useState<
    Record<string, number>
  >({});

  const userId =
    (session?.user as any)?.id ||
    (session?.user as any)?.userId ||
    (session?.user as any)?.sub ||
    (session?.user as any)?.uid;

  const { data: livePoll, mutate } = useSWR<Poll>(
    session?.accessToken
      ? ["poll", initialPoll.pollId, session.accessToken]
      : null,
    () => pollService.getById(initialPoll.pollId),
    {
      fallbackData: initialPoll,
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  );

  useEffect(() => {
    mutate();
  }, [initialPoll.pollId]);

  useEffect(() => {
    if (!initialPoll?.pollId || typeof window === "undefined") return;

    const genericVotedKey = `poll_voted_global_${initialPoll.pollId}`;
    const genericVoted = localStorage.getItem(genericVotedKey) === "true";

    let userVoted = false;
    if (userId) {
      const votedKey = `poll_voted_${initialPoll.pollId}_${userId}`;
      userVoted = localStorage.getItem(votedKey) === "true";

      const votedIdsKey = `poll_voted_ids_${initialPoll.pollId}_${userId}`;
      const rawIds = localStorage.getItem(votedIdsKey);
      if (rawIds) {
        try {
          setPreviouslyVotedOptionIds(new Set(JSON.parse(rawIds)));
        } catch {}
      }

      const typeKey = `poll_type_snapshot_${initialPoll.pollId}_${userId}`;
      setVotedTypeSnapshot(localStorage.getItem(typeKey));

      const countKey = `poll_options_count_snapshot_${initialPoll.pollId}_${userId}`;
      const savedCount = localStorage.getItem(countKey);
      if (savedCount !== null)
        setVotedOptionsCountSnapshot(parseInt(savedCount, 10));

      const voteCountsKey = `poll_vote_counts_${initialPoll.pollId}_${userId}`;
      const savedCounts = localStorage.getItem(voteCountsKey);
      if (savedCounts) {
        try {
          setPersistedVoteCounts(JSON.parse(savedCounts));
        } catch {}
      }
    }

    setLocalVoted(userVoted || genericVoted);
  }, [initialPoll.pollId, userId]);

  const poll = livePoll || initialPoll;
  const rawOptions = poll.options ?? [];
  const isExpired = new Date(poll.closingTime) < new Date();

  useEffect(() => {
    if (!rawOptions.length || typeof window === "undefined") return;
    const hasRealCounts = rawOptions.some((opt) => (opt.voteCount ?? 0) > 0);
    if (!hasRealCounts) return;

    const newCounts: Record<string, number> = {};
    rawOptions.forEach((opt, idx) => {
      if ((opt.voteCount ?? 0) > 0) {
        newCounts[opt.id] = opt.voteCount ?? 0;
        newCounts[`fallback_idx_${idx}`] = opt.voteCount ?? 0;
        newCounts[`fallback_text_${opt.text}`] = opt.voteCount ?? 0;
      }
    });

    setPersistedVoteCounts((prev) => {
      const merged = { ...prev, ...newCounts };
      if (userId) {
        localStorage.setItem(
          `poll_vote_counts_${initialPoll.pollId}_${userId}`,
          JSON.stringify(merged),
        );
      }
      localStorage.setItem(
        `poll_vote_counts_global_${initialPoll.pollId}`,
        JSON.stringify(merged),
      );
      return merged;
    });
  }, [rawOptions, userId, initialPoll.pollId]);

  useEffect(() => {
    setSelectedOptions([]);
  }, [poll?.multiSelect]);

  const currentPollTypeStr = poll.multiSelect ? "multi" : "single";
  const pollTypeHasChangedToSingle =
    votedTypeSnapshot === "multi" && currentPollTypeStr === "single";

  const serverHasVotedFlag = (() => {
    if (!rawOptions.length) return false;
    if ((poll as any).hasVoted === true || (poll as any).voted === true)
      return true;
    if ((poll as any).votedOptionId || (poll as any).selectedOptionId)
      return true;

    if (userId) {
      return rawOptions.some(
        (opt: any) =>
          opt.voters?.includes(userId) ||
          opt.votedUserIds?.includes(userId) ||
          opt.userVotes?.includes(userId) ||
          opt.votedUsers?.some(
            (u: any) => u.id === userId || u === userId || u.userId === userId,
          ) ||
          (poll as any).votedUserIds?.includes(userId) ||
          (poll as any).voters?.includes(userId),
      );
    }
    return false;
  })();

  const hasVoted =
    (localVoted || serverHasVotedFlag) && !pollTypeHasChangedToSingle;

  const hasNewOptionsBeenAddedByAdmin =
    hasVoted &&
    !!poll.multiSelect &&
    votedOptionsCountSnapshot !== null &&
    rawOptions.length > votedOptionsCountSnapshot;

  const canReVote =
    !justVoted &&
    hasVoted &&
    !isExpired &&
    (pollTypeHasChangedToSingle || hasNewOptionsBeenAddedByAdmin);
  const showResult = justVoted || (!canReVote && (hasVoted || isExpired));

  const options = rawOptions.map((opt, idx) => {
    let currentCount = opt.voteCount ?? 0;

    if (currentCount === 0) {
      if (persistedVoteCounts[opt.id] !== undefined) {
        currentCount = persistedVoteCounts[opt.id];
      } else if (
        persistedVoteCounts[`fallback_text_${opt.text}`] !== undefined
      ) {
        currentCount = persistedVoteCounts[`fallback_text_${opt.text}`];
      } else if (persistedVoteCounts[`fallback_idx_${idx}`] !== undefined) {
        currentCount = persistedVoteCounts[`fallback_idx_${idx}`];
      } else if (typeof window !== "undefined") {
        const globalCountsRaw = localStorage.getItem(
          `poll_vote_counts_global_${initialPoll.pollId}`,
        );
        if (globalCountsRaw) {
          try {
            const parsed = JSON.parse(globalCountsRaw);
            if (parsed[opt.id] !== undefined) currentCount = parsed[opt.id];
            else if (parsed[`fallback_text_${opt.text}`] !== undefined)
              currentCount = parsed[`fallback_text_${opt.text}`];
            else if (parsed[`fallback_idx_${idx}`] !== undefined)
              currentCount = parsed[`fallback_idx_${idx}`];
          } catch {}
        }
      }
    }

    if (justVoted && currentCount === 0) {
      if (
        selectedOptions.includes(opt.id) ||
        previouslyVotedOptionIds.has(opt.id)
      ) {
        currentCount = 1;
      }
    }

    return { ...opt, voteCount: currentCount };
  });

  const totalVotesSum = options.reduce(
    (acc, opt) => acc + (opt.voteCount ?? 0),
    0,
  );

  const uniqueVotersCount =
    (poll as any).votersCount ||
    (poll as any).totalVoters ||
    (() => {
      const uniqueUsers = new Set();
      options.forEach((opt: any) => {
        (opt.voters || opt.votedUserIds || opt.userVotes || []).forEach(
          (id: any) => {
            if (id)
              uniqueUsers.add(typeof id === "object" ? id.id || id.userId : id);
          },
        );
      });
      return uniqueUsers.size > 0 ? uniqueUsers.size : null;
    })();

  let denominator = poll.multiSelect
    ? uniqueVotersCount || totalVotesSum
    : totalVotesSum;
  if (denominator === 0 && hasVoted) {
    denominator = 1;
  }

  const handleSelect = (optionId: string) => {
    if (isExpired || isSubmitting) return;
    if (hasVoted && !canReVote) return;
    if (
      hasVoted &&
      previouslyVotedOptionIds.has(optionId) &&
      !pollTypeHasChangedToSingle
    )
      return;

    if (poll.multiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || selectedOptions.length === 0) return;

    const idsToSubmit = pollTypeHasChangedToSingle
      ? selectedOptions
      : selectedOptions.filter((id) => !previouslyVotedOptionIds.has(id));
    if (idsToSubmit.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await pollService.vote(
        poll.pollId,
        { optionIds: idsToSubmit },
        session.accessToken,
      );

      const updatedVotedIds = new Set([
        ...previouslyVotedOptionIds,
        ...idsToSubmit,
      ]);
      const currentTotalOptionsSize = options.length;

      localStorage.setItem(`poll_voted_global_${poll.pollId}`, "true");
      if (userId) {
        localStorage.setItem(`poll_voted_${poll.pollId}_${userId}`, "true");
        localStorage.setItem(
          `poll_voted_ids_${poll.pollId}_${userId}`,
          JSON.stringify([...updatedVotedIds]),
        );
        localStorage.setItem(
          `poll_options_count_snapshot_${poll.pollId}_${userId}`,
          currentTotalOptionsSize.toString(),
        );
        localStorage.setItem(
          `poll_type_snapshot_${poll.pollId}_${userId}`,
          currentPollTypeStr,
        );
      }

      setLocalVoted(true);
      setPreviouslyVotedOptionIds(updatedVotedIds);
      setVotedOptionsCountSnapshot(currentTotalOptionsSize);
      setVotedTypeSnapshot(currentPollTypeStr);
      setJustVoted(true);

      const freshPoll = await mutate();

      const countsToSave: Record<string, number> = {};
      const targets = freshPoll?.options || options;
      targets.forEach((opt: any, idx: number) => {
        const serverCount = opt.voteCount ?? 0;
        const persistedCount =
          persistedVoteCounts[opt.id] ??
          persistedVoteCounts[`fallback_idx_${idx}`] ??
          0;
        const isJustVotedOpt = idsToSubmit.includes(opt.id);

        const finalizedValue =
          serverCount > 0
            ? serverCount
            : persistedCount > 0
              ? persistedCount
              : isJustVotedOpt
                ? 1
                : 0;
        countsToSave[opt.id] = finalizedValue;
        countsToSave[`fallback_idx_${idx}`] = finalizedValue;
        countsToSave[`fallback_text_${opt.text}`] = finalizedValue;
      });

      if (userId) {
        localStorage.setItem(
          `poll_vote_counts_${poll.pollId}_${userId}`,
          JSON.stringify(countsToSave),
        );
      }
      localStorage.setItem(
        `poll_vote_counts_global_${poll.pollId}`,
        JSON.stringify(countsToSave),
      );
      setPersistedVoteCounts(countsToSave);
    } catch (err: any) {
      const message = err?.message?.toLowerCase() ?? "";
      if (
        message.includes("already voted") ||
        message.includes("already_voted") ||
        message.includes("null") ||
        message.includes("cache") ||
        message.includes("redis")
      ) {
        localStorage.setItem(`poll_voted_global_${poll.pollId}`, "true");
        if (userId) {
          localStorage.setItem(`poll_voted_${poll.pollId}_${userId}`, "true");
          localStorage.setItem(
            `poll_options_count_snapshot_${poll.pollId}_${userId}`,
            options.length.toString(),
          );
          localStorage.setItem(
            `poll_type_snapshot_${poll.pollId}_${userId}`,
            currentPollTypeStr,
          );
        }
        setLocalVoted(true);
        setJustVoted(true);
        mutate();
      } else {
        setError(err?.message || "Failed to submit vote. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePollAction(poll.pollId, poll.workspaceId);
      localStorage.removeItem(`poll_voted_global_${poll.pollId}`);
      localStorage.removeItem(`poll_vote_counts_global_${poll.pollId}`);
      if (userId) {
        localStorage.removeItem(`poll_voted_${poll.pollId}_${userId}`);
        localStorage.removeItem(`poll_voted_ids_${poll.pollId}_${userId}`);
        localStorage.removeItem(
          `poll_options_count_snapshot_${poll.pollId}_${userId}`,
        );
        localStorage.removeItem(`poll_type_snapshot_${poll.pollId}_${userId}`);
        localStorage.removeItem(`poll_vote_counts_${poll.pollId}_${userId}`);
      }
      onDelete();
    } catch {
      setError("Failed to delete poll. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <article
      className={`w-full bg-card rounded-xl p-3 sm:p-4 md:p-5 border border-subtle shadow-sm text-foreground transition-opacity ${isDeleting ? "opacity-0 pointer-events-none hidden" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex items-center justify-center p-2 rounded-lg border border-subtle/30 bg-subtle/10 text-subtle">
            <BarChart3 size={20} />
          </div>
          <h2 className="type-subtitle font-bold text-subtle tracking-tight text-xs sm:text-sm md:text-base break-words">
            {poll.title}
          </h2>
        </div>
        {(role === "admin" || role === "organizer") && (
          <EditPostDropDown
            title={poll.title}
            editUrl={`/event-management/edition/poll?pollId=${poll.pollId}`}
            onDelete={handleDelete}
          />
        )}
      </div>

      <p className="text-[10px] sm:text-xs md:text-sm text-grey-500 mb-3 sm:mb-4">
        {isExpired
          ? "Poll closed"
          : `Closes: ${formatEventDate(poll.closingTime)}`}
      </p>

      <legend className="type-desc text-foreground mb-3 sm:mb-6 block break-words text-xs sm:text-sm md:text-base">
        {poll.description ?? poll.title}
      </legend>

      {canReVote ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-5 mb-3 sm:mb-4">
            {options.map((option) => {
              const isOldOptionVoted = previouslyVotedOptionIds.has(option.id);
              const isChecked =
                isOldOptionVoted || selectedOptions.includes(option.id);

              return (
                <label
                  key={option.id}
                  className={`relative flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all select-none overflow-hidden ${
                    isOldOptionVoted
                      ? "border-grey-200 bg-grey-100 opacity-70 cursor-not-allowed"
                      : "border-grey-100 bg-grey-50 hover:bg-grey-100 hover:border-subtle/30 cursor-pointer"
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-3 sm:gap-4 flex-1 w-full">
                    <input
                      type="checkbox"
                      name={`poll-${poll.pollId}`}
                      value={option.id}
                      checked={isChecked}
                      disabled={isOldOptionVoted}
                      onChange={() => handleSelect(option.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all rounded-md ${
                        isOldOptionVoted
                          ? "bg-grey-300 border-grey-400"
                          : "bg-white border-grey-300"
                      }`}
                    >
                      {isChecked && (
                        <div className="bg-subtle w-2.5 h-2.5 rounded-sm" />
                      )}
                    </div>
                    <span className="type-detail-medium text-foreground text-xs sm:text-sm">
                      {option.text}{" "}
                      {isOldOptionVoted && (
                        <span className="text-xs text-grey-400 ml-1.5">
                          (Already Voted)
                        </span>
                      )}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
          {error && (
            <p className="text-destructive type-detail-small-medium mb-3 text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={selectedOptions.length === 0 || isSubmitting}
             className={`w-full py-2.5 sm:py-3.5 rounded-xl type-desc-semibold transition-all text-xs sm:text-sm md:text-base ${
              selectedOptions.length > 0 && !isSubmitting
                ? "bg-subtle text-white hover:opacity-90 active:scale-[0.99]"
                : "bg-subtle/40 text-white cursor-not-allowed"
            }`}
          >
            {isSubmitting
              ? "Submitting Additional Votes..."
              : "Submit New Options"}
          </button>
        </form>
      ) : showResult ? (
        <div className="w-full space-y-6">
          <div className="space-y-3 sm:space-y-5">
            {options.map((option) => {
              const currentVotes = option.voteCount ?? 0;
              const adjustedDenominator = denominator === 0 ? 1 : denominator;
              const percentage = Math.min(
                Math.round((currentVotes / adjustedDenominator) * 100),
                100,
              );
              return (
                <div key={option.id} className="w-full select-none">
                  <div className="flex flex-wrap justify-between items-center gap-1 mb-1.5">
                    <span className="type-detail-medium text-foreground font-medium text-xs sm:text-sm">
                      {option.text}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* <span className="type-detail-small text-grey-400">
                        ({currentVotes})
                      </span> */}
                      <span className="type-detail-semibold text-subtle font-bold">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-[#e8fbf4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-subtle rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center type-detail-medium text-grey-400 mt-3 text-xs sm:text-sm">
            {isExpired ? "Poll closed" : `Total participants: ${denominator}`}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-5 mb-4 sm:mb-6">
            {options.map((option) => {
              const isChecked = selectedOptions.includes(option.id);
              return (
                <label
                  key={option.id}
                  className="relative flex items-center justify-between p-4 rounded-xl border border-grey-100 bg-grey-50 hover:bg-grey-100 hover:border-subtle/30 cursor-pointer transition-all select-none overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-3 sm:gap-4 w-full">
                    <input
                      type={poll.multiSelect ? "checkbox" : "radio"}
                      name={`poll-${poll.pollId}`}
                      value={option.id}
                      checked={isChecked}
                      onChange={() => handleSelect(option.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border flex items-center justify-center transition-all bg-white border-grey-300 shrink-0 ${poll.multiSelect ? "rounded-md" : "rounded-full"}`}
                    >
                      {isChecked && (
                        <div
                          className={`bg-subtle ${poll.multiSelect ? "w-2.5 h-2.5 rounded-sm" : "w-2.5 h-2.5 rounded-full"}`}
                        />
                      )}
                    </div>
                    <span className="type-detail-medium text-foreground text-sm sm:text-base">
                      {option.text}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
          {error && (
            <p className="text-destructive type-detail-small-medium mb-3 text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={selectedOptions.length === 0 || isSubmitting}
            className={`w-full py-2 sm:py-3 md:py-3.5 rounded-xl type-desc-semibold transition-all text-xs sm:text-sm md:text-base ${selectedOptions.length > 0 && !isSubmitting ? "bg-subtle text-white hover:opacity-90 active:scale-[0.99]" : "bg-subtle/50 text-white cursor-not-allowed"}`}
          >
            {isSubmitting ? "Submitting..." : "Vote Now"}
          </button>
        </form>
      )}
    </article>
  );
}

export function PollCard({ role, polls, onDeletePoll }: PollCardProps) {
  return (
    <>
      {polls.map((poll) => (
        <PollItem
          key={poll.pollId}
          initialPoll={poll}
          role={role}
          onDelete={() => onDeletePoll(poll.pollId)}
        />
      ))}
    </>
  );
}
