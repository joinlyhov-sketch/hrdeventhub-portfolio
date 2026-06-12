"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowUp,
  BadgeDollarSign,
  ListFilter,
  MoveUp,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import { StatsCard } from "./../../dashboard/transaction-history/StatsCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";
import { PaginationDemo } from "@/components/feedback/Pagination";
import { eventService, Participant } from "@/service/event.service";
import { profileService } from "@/service/profile.service";
import { Post } from "@/types/posts";

const ITEMS_PER_PAGE = 5;
const EMPTY_VALUE = "Not provided";

type RegistrationRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  gen: string;
  status: string;
  time: string;
  avatar: string;
  registeredAt: string;
};

type AdminOverviewProps = {
  event: Post;
  workspaceId: string;
};

const isSameDay = (date: Date, compareDate: Date) =>
  date.getFullYear() === compareDate.getFullYear() &&
  date.getMonth() === compareDate.getMonth() &&
  date.getDate() === compareDate.getDate();

const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

const getDisplayValue = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY_VALUE;
};

const formatRelativeTime = (value?: string) => {
  if (!value) return EMPTY_VALUE;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getGenerationNumber = (name?: string) => {
  if (!name) return EMPTY_VALUE;
  return name.match(/\d+/)?.[0] ?? name;
};

const formatGender = (gender?: string) => {
  const normalized = gender?.trim().toLowerCase();
  if (!normalized) return EMPTY_VALUE;
  if (normalized === "m" || normalized === "male") return "Male";
  if (normalized === "f" || normalized === "female") return "Female";
  return gender!;
};

const normalizePaymentStatus = (status?: string) => {
  const normalized = (status || "").toLowerCase();
  if (
    ["successful", "success", "paid", "active", "free"].includes(normalized)
  ) {
    return "Paid";
  }
  return "Unpaid";
};

const mapParticipantToRegistration = (
  participant: Participant,
): RegistrationRow => {
  const user = participant.user;
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    participant.appUserId ||
    "Unknown user";

  return {
    id: participant.participantId,
    name: fullName,
    email: getDisplayValue(user?.email),
    phone: getDisplayValue(user?.phoneNumber),
    gender: formatGender(user?.gender),
    gen: getGenerationNumber(user?.generation?.name),
    status: normalizePaymentStatus(participant.paymentStatus),
    time: formatRelativeTime(participant.registeredAt),
    avatar: user?.profilePicture || "/placeholder-avatar.png",
    registeredAt: participant.registeredAt,
  };
};

export function AdminOverview({ event, workspaceId }: AdminOverviewProps) {
  const { data: session } = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGen, setSelectedGen] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    if (!event.postId || !workspaceId || !session?.accessToken) return;

    let isActive = true;

    const loadRegistrations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await eventService.getParticipants(
          session.accessToken!,
          event.postId,
          1,
          100,
        );

        const enrichedData = await Promise.all(
          data.map(async (participant) => {
            const userId = participant.user?.appUserId || participant.appUserId;
            if (!userId) return participant;

            try {
              const profile = await profileService.getProfileById(
                userId,
                session.accessToken!,
              );
              const profileUser = profile.payload.appUser;

              return {
                ...participant,
                user: {
                  ...participant.user,
                  appUserId: profileUser.appUserId,
                  username: profileUser.username,
                  firstName: profileUser.firstName,
                  lastName: profileUser.lastName,
                  email: participant.user?.email || profileUser.email,
                  phoneNumber:
                    participant.user?.phoneNumber || profileUser.phoneNumber,
                  gender: participant.user?.gender || profileUser.gender,
                  profilePicture:
                    participant.user?.profilePicture ||
                    profile.payload.profilePicture ||
                    "",
                  generation:
                    participant.user?.generation || profile.payload.generation,
                },
              };
            } catch (profileError) {
              console.error(
                "Failed to load participant profile:",
                profileError,
              );
              return participant;
            }
          }),
        );

        if (isActive) setParticipants(enrichedData);
      } catch (err) {
        console.error("Failed to load event registrations:", err);
        if (isActive) setError("Failed to load registrations.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadRegistrations();

    return () => {
      isActive = false;
    };
  }, [event.postId, session?.accessToken, workspaceId]);

  const registrations = useMemo(
    () => participants.map(mapParticipantToRegistration),
    [participants],
  );

  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
    setCurrentPage(1);
  };

  const handleGenChange = (value: string) => {
    setSelectedGen(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const uniqueGenerations = useMemo(() => {
    const generations = registrations.map((user) => user.gen);
    return Array.from(
      new Set(generations.filter((gen) => gen !== EMPTY_VALUE)),
    ).sort((a, b) => Number(a) - Number(b));
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((user) => {
      const matchesGen = selectedGen === "all" || user.gen === selectedGen;
      const matchesStatus =
        selectedStatus === "all" || user.status === selectedStatus;

      return matchesGen && matchesStatus;
    });
  }, [registrations, selectedGen, selectedStatus]);

  const totalPages = useMemo(() => {
    if (showAll) return 1;
    return Math.max(
      1,
      Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE),
    );
  }, [filteredRegistrations, showAll]);

  const paginatedRegistrations = useMemo(() => {
    if (showAll) return filteredRegistrations;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRegistrations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRegistrations, currentPage, showAll]);

  const statsData = useMemo(() => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const paidRegistrations = participants.filter(
      (participant) =>
        normalizePaymentStatus(participant.paymentStatus) === "Paid",
    );
    const eventPrice = event.payment?.paymentAmount ?? 0;
    const totalPayment =
      event.payment?.amountRaised && event.payment.amountRaised > 0
        ? event.payment.amountRaised
        : paidRegistrations.length * eventPrice;
    const todayCount = participants.filter((participant) => {
      const registeredDate = new Date(participant.registeredAt);
      return (
        !Number.isNaN(registeredDate.getTime()) &&
        isSameDay(registeredDate, now)
      );
    }).length;
    const weekCount = participants.filter((participant) => {
      const registeredDate = new Date(participant.registeredAt);
      return (
        !Number.isNaN(registeredDate.getTime()) &&
        registeredDate >= startOfWeek &&
        registeredDate <= now
      );
    }).length;

    return [
      {
        title: "Total Payment",
        value: `$${totalPayment.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        iconName: "BadgeDollarSign",
        colorKey: "primary",
      },
      {
        title: "Total Attendee",
        value: String(participants.length),
        iconName: "UserRound",
        colorKey: "action",
      },
      {
        title: "Today",
        value: todayCount > 0 ? `+${todayCount}` : "0",
        iconName: "UserRoundCheck",
        colorKey: "subtle",
      },
      {
        title: "This week",
        value: weekCount > 0 ? `+${weekCount}` : "0",
        iconName: "UserRoundCheck",
        colorKey: "secondary",
      },
    ];
  }, [event.payment, participants]);

  const iconRegistry = {
    BadgeDollarSign: BadgeDollarSign,
    UserRound: UserRound,
    UserRoundCheck: UserRoundCheck,
  };

  const styleRegistry = {
    primary: { text: "text-primary", bg: "bg-primary/10" },
    action: { text: "text-action", bg: "bg-action/10" },
    subtle: { text: "text-subtle", bg: "bg-subtle/10" },
    secondary: { text: "text-secondary", bg: "bg-secondary/10" },
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => {
            const SelectedIcon =
              iconRegistry[stat.iconName as keyof typeof iconRegistry];
            const styles =
              styleRegistry[stat.colorKey as keyof typeof styleRegistry];

            if (!SelectedIcon || !styles) return null;

            const generatedCustomIcon = (
              <div className={`${styles.bg} p-3 rounded-full shrink-0 w-fit`}>
                <SelectedIcon size={28} className={styles.text} />
              </div>
            );

            return (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                color={stat.colorKey}
                customIcon={generatedCustomIcon}
              />
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="type-detail-semibold text-grey-900 font-semibold text-base">
              Recent registrations
            </h3>
            <button
              onClick={handleToggleShowAll}
              className={`${
                showAll
                  ? "bg-secondary text-white hover:bg-opacity-90"
                  : "bg-[#EBF5FF] text-secondary hover:bg-blue-100"
              } transition-colors flex items-center justify-center gap-x-1.5 py-1.5 rounded-full text-xs font-semibold w-28`}
            >
              <span>{showAll ? "see less" : "see all"}</span>
              <ArrowUp
                size={12}
                strokeWidth={2.5}
                className={`transition-transform duration-200 shrink-0 ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {isLoading && (
            <div className="rounded-xl border border-border bg-white p-5 text-center text-sm text-gray-400">
              Loading registrations...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse table-fixed min-w-175">
              <thead>
                <tr className="bg-secondary text-grey-100 text-sm font-medium">
                  <th className="p-3.5 pl-5 w-[30%]">Username & Email</th>
                  <th className="p-3.5 text-center w-[15%]">Phone</th>
                  <th className="p-3.5 text-center w-[12%]">Gender</th>

                  <th className="p-3.5 text-center w-[13%]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center gap-x-1 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                          <span>
                            Gen{" "}
                            {selectedGen !== "all" ? `(${selectedGen})` : ""}
                          </span>
                          <MoveUp size={16} className="shrink-0" />
                          <ListFilter size={16} className="shrink-0" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-33.75">
                        <DropdownMenuRadioGroup
                          value={selectedGen}
                          onValueChange={handleGenChange}
                        >
                          <DropdownMenuRadioItem
                            value="all"
                            className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                          >
                            All
                          </DropdownMenuRadioItem>
                          {uniqueGenerations.map((gen) => (
                            <DropdownMenuRadioItem
                              key={gen}
                              value={gen}
                              className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                            >
                              Generation {gen}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </th>

                  <th className="p-3.5 text-center w-[15%]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center gap-x-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                          <span>
                            Status{" "}
                            {selectedStatus !== "all"
                              ? `(${selectedStatus})`
                              : ""}
                          </span>
                          <ListFilter size={16} className="shrink-0" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-31.25">
                        <DropdownMenuRadioGroup
                          value={selectedStatus}
                          onValueChange={handleStatusChange}
                        >
                          <DropdownMenuRadioItem
                            value="all"
                            className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                          >
                            All
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            value="Paid"
                            className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                          >
                            Paid
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            value="Unpaid"
                            className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                          >
                            Unpaid
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </th>

                  <th className="p-3.5 pr-5 text-center w-[15%]">
                    <div className="flex items-center justify-center gap-x-2">
                      <span>Registered</span>
                      <ListFilter size={16} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-[#4A5568] text-sm">
                {paginatedRegistrations.length > 0 ? (
                  paginatedRegistrations.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="p-3.5 pl-5 flex items-center gap-x-3 overflow-hidden">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-gray-100"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-[#1A202C] truncate">
                            {user.name}
                          </span>
                          {user.email !== EMPTY_VALUE && (
                            <span className="text-gray-400 text-xs font-normal truncate">
                              {user.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-center text-gray-600 font-normal truncate">
                        {user.phone}
                      </td>
                      <td className="p-3.5 text-center text-gray-500 font-normal">
                        {user.gender}
                      </td>
                      <td className="p-3.5 text-center text-gray-500 font-normal">
                        {user.gen}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-block text-center min-w-17.5 ${
                            user.status === "Paid"
                              ? "bg-[#E6F9F5] text-[#00A878] border-[#CCEFE7]"
                              : "bg-[#FEE2E2] text-[#EF4444] border-[#FCA5A5]"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-gray-400 font-normal pr-5">
                        {user.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-gray-400 font-medium"
                    >
                      No recent registrations match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!showAll && filteredRegistrations.length > 0 && (
            <PaginationDemo
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
