"use client";

import { useState, useMemo } from "react";
import {
  ArrowUp,
  BadgeDollarSign,
  ListFilter,
  MoveUp,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import { StatsCard } from "./../../dashboard/transaction-history/StatsCard";
import { mockStatsData } from "../../../data/event-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";
import { PaginationDemo } from "@/components/feedback/Pagination";
import { initialRegistrations } from "../../../data/registrations";

const ITEMS_PER_PAGE = 5;

export function AdminOverview() {
  const [registrations] = useState(initialRegistrations);
  const [selectedGen, setSelectedGen] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAll, setShowAll] = useState<boolean>(false);

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
    return Array.from(new Set(generations)).sort(
      (a, b) => Number(a) - Number(b),
    );
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

  const fetchedData = mockStatsData;

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {fetchedData.map((stat, index) => {
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
                  paginatedRegistrations.map((user, i) => (
                    <tr
                      key={i}
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
                          <span className="text-gray-400 text-xs font-normal truncate">
                            {user.email}
                          </span>
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
