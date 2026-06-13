"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  ListFilter,
  Pencil,
  Trash2,
  UserX,
  XCircle,
} from "lucide-react";
import { EventItem } from "@/service/event.service";
import {
  changePostStatusAction,
  deletePostAction,
  publishDraftPostAction,
} from "@/actions/post.action";
import { DeleteEventModal } from "@/components/dashboard/delete-event-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";
import { PaginationDemo } from "../../feedback/Pagination";
import Link from "next/link";
import ActionDropdown, {
  DropdownAction,
} from "@/components/site/pop-up/action-button/ActionDropdown";
import { toast } from "sonner";
import { CloseEventModal } from "../close-event-model";
import { PublishEventModal } from "../publish-event-modal";

interface EventManagementTableProps {
  events: EventItem[];
  searchTerm: string;
}

const getStatusStyles = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "active":
    case "published":
    case "open":
      return "bg-[#E6F9F1] text-accent";
    case "draft":
      return "bg-gray-100 text-gray-500";
    case "cancel":
    case "closed":
      return "bg-[#FEE2E2] text-[#EF4444]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

export function EventManagementTable({
  events,
  searchTerm,
}: EventManagementTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<{
    id: string;
    title: string;
    groudId: string | undefined;
  } | null>(null);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closeEventData, setCloseEventData] = useState<{
    id: string;
    title: string;
    groupId: string | undefined;
  } | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishEventData, setPublishEventData] = useState<{
    id: string;
    title: string;
    groupId: string | undefined;
  } | null>(null);

  const itemsPerPage = 10;
  const filteredEvents = useMemo(() => {
    return (events || []).filter((event) => {
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        event.status?.toLowerCase() === selectedStatus.toLowerCase();

      let matchesDate = true;
      if (selectedDateRange !== "all" && event.createdAt) {
        const eventDate = new Date(event.eventStart);
        const now = new Date();

        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const diffTime = today.getTime() - eventDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (selectedDateRange === "today") {
          matchesDate = eventDate.toDateString() === today.toDateString();
        } else if (selectedDateRange === "yesterday") {
          matchesDate = eventDate.toDateString() === yesterday.toDateString();
        } else if (selectedDateRange === "7days") {
          matchesDate = diffDays >= 0 && diffDays <= 7;
        } else if (selectedDateRange === "30days") {
          matchesDate = diffDays >= 0 && diffDays <= 30;
        } else if (selectedDateRange === "thisMonth") {
          matchesDate =
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear();
        } else if (selectedDateRange === "lastMonth") {
          const lastMonthTarget =
            now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear =
            now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          matchesDate =
            eventDate.getMonth() === lastMonthTarget &&
            eventDate.getFullYear() === lastMonthYear;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [events, searchTerm, selectedStatus, selectedDateRange]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);
  const handleDeleteExecute = async (
    groupId: string | undefined,
    postId: string | undefined,
  ) => {
    console.log("show groupID: ", closeEventData);
    if (!groupId || !postId) return;

    await new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          await deletePostAction(groupId, postId);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  const handlePublishExecute = async (groupId: string, postId: string) => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await publishDraftPostAction(groupId, postId);
          if (result.ok) {
            toast.success("Published event live successfully!");
            router.refresh();
            resolve();
          } else {
            toast.error(`Error publishing event: ${result.error}`);
            reject(new Error(result.error));
          }
        } catch (err) {
          console.error(err);
          toast.error("An unexpected execution exception occurred.");
          reject(err);
        }
      });
    });
  };

  const handleCloseExecute = async (
    groupId: string,
    postId: string,
    reason: string,
  ) => {
    startTransition(async () => {
      try {
        const result = await changePostStatusAction(groupId, postId, {
          status: "closed",
          reason: reason,
        });

        if (result.ok) {
          toast.success("Closed event successfully!");
          router.refresh();
        } else {
          toast.error(`Error closing event: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
        toast.error("An unexpected execution exception occurred.");
      }
    });
  };

  const dateLabels: Record<string, string> = {
    all: "Date",
    today: "Today",
    yesterday: "Yesterday",
    "7days": "Last 7 Days",
    "30days": "Last 30 Days",
    thisMonth: "This Month",
    lastMonth: "Last Month",
  };

  return (
    <div className="space-y-6">
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 min-h-145 bg-white">
        <Table className="w-full text-left border-collapse min-w-250 table-fixed">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b-0 h-13">
              <TableHead className="px-5 py-3 text-center text-white type-desc-semibold w-[6%]">
                No.
              </TableHead>
              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[24%]">
                Event Name
              </TableHead>
              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[18%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        {selectedDateRange === "all"
                          ? "Date"
                          : dateLabels[selectedDateRange]}
                      </span>
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-37.5">
                    <DropdownMenuRadioGroup
                      value={selectedDateRange}
                      onValueChange={(val) => {
                        setSelectedDateRange(val);
                        setCurrentPage(1);
                      }}
                    >
                      {Object.keys(dateLabels).map((key) => (
                        <DropdownMenuRadioItem
                          key={key}
                          value={key}
                          className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                        >
                          {key === "all" ? "All" : dateLabels[key]}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[15%]">
                Category
              </TableHead>
              <TableHead className="px-5 py-3 text-left text-white type-desc-semibold w-[15%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span className="truncate">
                        Status{" "}
                        {selectedStatus !== "all" ? `(${selectedStatus})` : ""}
                      </span>
                      <ListFilter size={16} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-32.5">
                    <DropdownMenuRadioGroup
                      value={selectedStatus}
                      onValueChange={(val) => {
                        setSelectedStatus(val);
                        setCurrentPage(1);
                      }}
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        All
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="active"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Active
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="draft"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Draft
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="closed"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Closed
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="px-5 py-3 text-center text-white type-desc-semibold w-[12%]">
                Attendee
              </TableHead>
              <TableHead className="px-5 py-3 text-center text-white type-desc-semibold w-[10%]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event, index) => {
                const groupId = event.workspaceId;
                const absoluteIndex =
                  (currentPage - 1) * itemsPerPage + index + 1;
                const eventWorkspaceId =
                  event.sourceWorkspaceId || event.workspaceId;

                const currentItemActions: DropdownAction[] = [
                  {
                    label: "Update",
                    icon: Pencil,
                    onClick: () => {
                      if (!eventWorkspaceId) return;
                      router.push(
                        `/event-management/edition/event?groupId=${groupId}&postId=${event.postId}&admin=true`,
                      );
                    },
                  },
                  {
                    label: "Delete",
                    icon: Trash2,
                    onClick: () => {
                      setActiveEvent({
                        id: event.postId,
                        title: event.title,
                        groudId: groupId,
                      });
                      setIsDeleteModalOpen(true);
                    },
                  },
                ];
                if (event.status?.toLowerCase() != "active") {
                  currentItemActions.push({
                    label: "Public",
                    icon: Globe,
                    onClick: () => {
                      setPublishEventData({
                        id: event.postId,
                        title: event.title,
                        groupId: groupId,
                      });
                      setIsPublishModalOpen(true);
                    },
                  });
                }

                if (event.status?.toLowerCase() !== "closed") {
                  currentItemActions.push({
                    label: "Close",
                    icon: XCircle,
                    onClick: () => {
                      setCloseEventData({
                        id: event.postId,
                        title: event.title,
                        groupId: groupId,
                      });
                      setIsCloseModalOpen(true);
                    },
                  });
                }

                return (
                  <TableRow
                    key={event.postId}
                    className="hover:bg-gray-50/80 border-b border-gray-100 h-14"
                  >
                    <TableCell className="text-center text-secondary type-desc">
                      {absoluteIndex}
                    </TableCell>

                    <TableCell
                      title={event.title}
                      className="max-w-35 truncate text-left text-primary type-desc cursor-pointer"
                    >
                      <Link
                        href={`/event-management/attendees-list/${event.postId}`}
                        className="hover:underline"
                      >
                        {event.title}
                      </Link>
                    </TableCell>

                    <TableCell
                      title={event.eventStart}
                      className="max-w-35 truncate text-left text-gray-500 type-desc"
                    >
                      {formatDate(event.eventStart)}
                    </TableCell>

                    <TableCell
                      title={event.category}
                      className="max-w-30 truncate text-left text-gray-500 type-desc"
                    >
                      {event.category || "-"}
                    </TableCell>

                    <TableCell className="text-left">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full type-desc-small-semibold font-bold whitespace-nowrap capitalize ${getStatusStyles(
                          event.status,
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {event.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-center text-secondary type-desc">
                      {(event.attendeeCount ?? 0).toLocaleString()}
                    </TableCell>

                    <TableCell className="text-center">
                      <ActionDropdown actions={currentItemActions} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent border-b-0">
                <TableCell colSpan={7} className="px-6 py-16 text-center h-130">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-slate-400 border border-slate-100">
                      <UserX size={30} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-secondary">
                        Event doesn&apos;t exist
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        We couldn&apos;t find any events match for your search.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredEvents.length > 0 && (
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setActiveEvent(null);
        }}
        eventTitle={activeEvent?.title || ""}
        onConfirm={() =>
          handleDeleteExecute(activeEvent?.groudId, activeEvent?.id)
        }
      />

      <CloseEventModal
        isOpen={isCloseModalOpen}
        onClose={() => {
          setIsCloseModalOpen(false);
          setCloseEventData(null);
        }}
        eventTitle={closeEventData?.title || ""}
        onConfirm={async (reason) => {
          if (closeEventData?.groupId && closeEventData?.id) {
            await handleCloseExecute(
              closeEventData.groupId,
              closeEventData.id,
              reason,
            );
          }
        }}
      />

      <PublishEventModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishEventData(null);
        }}
        eventTitle={publishEventData?.title || ""}
        onConfirm={async () => {
          if (publishEventData?.groupId && publishEventData?.id) {
            await handlePublishExecute(
              publishEventData.groupId,
              publishEventData.id,
            );
          }
        }}
      />
    </div>
  );
}
