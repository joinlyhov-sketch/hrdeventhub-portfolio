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
import Link from "next/link";
import { StatsCard } from "./../../dashboard/transaction-history/StatsCard";
import { mockStatsData } from "../../../data/event-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";

export function AdminOverview() {
  const initialRegistrations = [
    {
      name: "Sok Sambath",
      email: "sambathsok@gmail.com",
      phone: "012 921 999",
      gender: "Female",
      gen: "11",
      status: "Paid",
      time: "2 min ago",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    {
      name: "Chan Nika",
      email: "nikachan.dev@gmail.com",
      phone: "097 23 34 56",
      gender: "Male",
      gen: "12",
      status: "Paid",
      time: "2 min ago",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    },
    {
      name: "Keo Rotha",
      email: "rothakeo99@gmail.com",
      phone: "010 345 231",
      gender: "Female",
      gen: "11",
      status: "Paid",
      time: "2 min ago",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    },
  ];

  const [registrations] = useState(initialRegistrations);
  const [selectedGen, setSelectedGen] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

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
            const SelectedIcon = iconRegistry[stat.iconName];
            const styles = styleRegistry[stat.colorKey];

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
            <Link
              href="#"
              className="bg-[#EBF5FF] text-secondary hover:bg-blue-100 transition-colors flex items-center gap-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold"
            >
              see all <ArrowUp size={12} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary text-grey-100 text-sm font-medium">
                  <th className="p-3.5 pl-5">Username & Email</th>
                  <th className="p-3.5 text-center">Phone</th>
                  <th className="p-3.5 text-center">Gender</th>

                  <th className="p-3.5 text-center">
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
                      <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[135px]">
                        <DropdownMenuRadioGroup
                          value={selectedGen}
                          onValueChange={setSelectedGen}
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

                  <th className="p-3.5 text-center">
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
                      <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[125px]">
                        <DropdownMenuRadioGroup
                          value={selectedStatus}
                          onValueChange={setSelectedStatus}
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
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </th>

                  <th className="p-3.5 pr-5 text-center">
                    <div className="flex items-center justify-center gap-x-2">
                      <span>Registered</span>
                      <ListFilter size={16} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-[#4A5568] text-sm">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((user, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="p-3.5 pl-5 flex items-center gap-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-gray-100"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#1A202C]">
                            {user.name}
                          </span>
                          <span className="text-gray-400 text-xs font-normal">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center text-gray-600 font-normal">
                        {user.phone}
                      </td>
                      <td className="p-3.5 text-center text-gray-500 font-normal">
                        {user.gender}
                      </td>
                      <td className="p-3.5 text-center text-gray-500 font-normal">
                        {user.gen}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="bg-[#E6F9F5] text-[#00A878] px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[#CCEFE7]">
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
        </div>
      </div>
    </>
  );
}
