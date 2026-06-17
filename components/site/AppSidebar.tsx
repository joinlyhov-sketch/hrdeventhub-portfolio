"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/drop-down/dropdown-menu";
import Image from "next/image";
import {
  LogOut,
  Pin,
  MessageCircle,
  ClipboardList,
  User,
  Pencil,
  Settings,
  ChevronRight,
  Circle,
  MinusCircle,
  Moon,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutModal } from "./pop-up/commons/LogoutModal";
import { useCurrentUser } from "@/context/user-context";
import { logoutAction } from "@/actions/auth.action";
import { useMyWorkspaces } from "@/hooks/use-my-workspace";
import { setOnlineAction, setOfflineAction } from "@/actions/presence.action";
import { useStatusContext, ActiveStatus } from "@/context/StatusContext";
import { useNotificationStore } from "@/store/useNotificationStore";

const ADMIN_ROLES = ["admin", "organizer"] as const;
const STUDENT_ALUMNI_ROLES = ["student", "alumni"] as const;

const STATUS_OPTIONS: {
  value: ActiveStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "online",
    label: "Online",
    icon: <Circle size={10} className="fill-current" />,
    color: "text-green-500",
  },
  {
    value: "do-not-disturb",
    label: "Do Not Disturb",
    icon: <MinusCircle size={10} />,
    color: "text-red-500",
  },
  {
    value: "offline",
    label: "Appear Offline",
    icon: <Moon size={10} />,
    color: "text-gray-400",
  },
];

function StatusDot({ status }: { status: ActiveStatus }) {
  const colorMap: Record<ActiveStatus, string> = {
    online: "bg-green-500",
    idle: "bg-yellow-400",
    "do-not-disturb": "bg-red-500",
    offline: "bg-gray-400",
  };
  return (
    <span
      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${colorMap[status]}`}
    />
  );
}

export function AppSidebar() {
  const { currentUser } = useCurrentUser();
  const { data: session } = useSession();
  const { state } = useSidebar();
  const pathname = usePathname();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const { activeStatus, setActiveStatus } = useStatusContext();
  const { unreadCount } = useNotificationStore();

  const isAdmin = currentUser?.role === "admin";
  const isStudentOrAlumni = STUDENT_ALUMNI_ROLES.includes(
    currentUser?.role as (typeof STUDENT_ALUMNI_ROLES)[number],
  );
  const memberData = useMyWorkspaces();
  const pinnedWorkspaces = isAdmin
    ? []
    : memberData.workspaces.filter((w) => w.isPinned === true);
  const profileHref = `/profile/${currentUser?.id ?? "1"}`;
  const canSeeAdministration =
    currentUser !== null &&
    ADMIN_ROLES.includes(currentUser?.role as (typeof ADMIN_ROLES)[number]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const savedStatus = (
      typeof window !== "undefined"
        ? localStorage.getItem("activeStatus")
        : null
    ) as ActiveStatus | null;

    const statusToApply: ActiveStatus =
      savedStatus &&
      ["online", "do-not-disturb", "offline"].includes(savedStatus)
        ? savedStatus
        : "online";

    setActiveStatus(statusToApply);

    if (statusToApply === "offline") {
      setOfflineAction();
    } else {
      setOnlineAction();
    }
  }, [session?.accessToken]);

  const handleStatusChange = async (status: ActiveStatus) => {
  setActiveStatus(status);
  localStorage.setItem("activeStatus", status);
  if (status === "offline") {
    await setOfflineAction();
  } else {
    await setOnlineAction();
  }
};

  const handleConfirmLogout = async () => {
    setIsLogoutOpen(false);
    await setOfflineAction();
    if (session?.refreshToken) {
      await logoutAction(session.refreshToken);
    }
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r z-50">
        <SidebarHeader className="border-b py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                className={`transition-all duration-300 ease-in-out ${state === "collapsed" ? "justify-center" : "justify-start"}`}
              >
                <Link href="/">
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${state === "collapsed" ? "w-auto opacity-100 scale-100" : "w-0 hidden scale-75"}`}
                  >
                    <Image
                      src="/images/hrdLogo.webp"
                      alt="HRD Event Hub Logo"
                      width={35}
                      height={35}
                      className="shrink-0"
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${state === "collapsed" ? "w-0 opacity-0" : "w-auto scale-150 opacity-100 ml-4"}`}
                  >
                    <Image
                      src="/images/HrdEventHub.webp"
                      alt="HRD Event Hub Text Logo"
                      width={102}
                      height={27}
                      className="m-auto shrink-0"
                    />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger />
        </SidebarHeader>

        <SidebarContent className="py-2">
          {!isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel
                className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
              >
                Pinned
              </SidebarGroupLabel>
              <SidebarMenu className="flex flex-col gap-1">
                {pinnedWorkspaces.length === 0 ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Pin a workspace to see it here"
                      className="h-auto cursor-default hover:bg-transparent focus:bg-transparent"
                      disabled
                    >
                      <Pin
                        size={16}
                        className="shrink-0 text-muted-foreground/50"
                      />
                      <span
                        className={`overflow-hidden whitespace-normal transition-all duration-500 ease-in-out text-xs text-muted-foreground/60 leading-snug ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                      >
                        Pin a workspace to show it here
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  pinnedWorkspaces.map((workspace) => {
                    const href = `/group/${workspace.workspaceId}`;
                    const isActive = pathname === href;
                    return (
                      <SidebarMenuItem key={workspace.workspaceId}>
                        <SidebarMenuButton
                          asChild
                          tooltip={workspace.name}
                          className="h-11"
                          isActive={isActive}
                        >
                          <Link
                            href={href}
                            className="group/btn flex items-center gap-2 w-full"
                          >
                            <span className="flex items-center justify-center text-[9px] font-bold shrink-0 uppercase transition-transform duration-200 group-hover/btn:-rotate-18">
                              <Pin />
                            </span>
                            <span
                              className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${
                                state === "collapsed"
                                  ? "max-w-0 opacity-0 -translate-x-2"
                                  : "max-w-50 opacity-100 translate-x-0"
                              }`}
                            >
                              {workspace.name}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroup>
          )}

          <SidebarGroup>
            <SidebarGroupLabel
              className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
            >
              General
            </SidebarGroupLabel>
            <SidebarMenu className="flex flex-col gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/group"}
                  asChild
                  tooltip="Group"
                  className="h-11"
                >
                  <Link href="/group">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.87187 8.1525C6.79687 8.145 6.70687 8.145 6.62437 8.1525C4.83937 8.0925 3.42188 6.63 3.42188 4.83C3.42187 2.9925 4.90688 1.5 6.75188 1.5C8.58938 1.5 10.0819 2.9925 10.0819 4.83C10.0744 6.63 8.65688 8.0925 6.87187 8.1525Z"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.3084 3C13.7634 3 14.9334 4.1775 14.9334 5.625C14.9334 7.0425 13.8084 8.1975 12.4059 8.25C12.3459 8.2425 12.2784 8.2425 12.2109 8.25"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.11906 10.92C1.30406 12.135 1.30406 14.115 3.11906 15.3225C5.18156 16.7025 8.56406 16.7025 10.6266 15.3225C12.4416 14.1075 12.4416 12.1275 10.6266 10.92C8.57156 9.5475 5.18906 9.5475 3.11906 10.92Z"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.7539 15C14.2939 14.8875 14.8039 14.67 15.2239 14.3475C16.3939 13.47 16.3939 12.0225 15.2239 11.145C14.8114 10.83 14.3089 10.62 13.7764 10.5"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                    >
                      Group
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/calendar"}
                  asChild
                  tooltip="Calendar"
                  className="h-11"
                >
                  <Link href="/calendar">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 1.5V3.75"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 1.5V3.75"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.75 6.375V10.2225C15.0825 9.69 14.235 9.375 13.3125 9.375C12.39 9.375 11.5275 9.69748 10.8525 10.245C9.945 10.9575 9.375 12.075 9.375 13.3125C9.375 14.0475 9.58501 14.7525 9.94501 15.3375C10.2225 15.795 10.5825 16.1925 11.01 16.5H6C3.375 16.5 2.25 15 2.25 12.75V6.375C2.25 4.125 3.375 2.625 6 2.625H12C14.625 2.625 15.75 4.125 15.75 6.375Z"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.25 8.25H9.75"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.25 12H7.215"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.25 13.3125C17.25 14.0475 17.04 14.7525 16.68 15.3375C16.47 15.6975 16.2075 16.0125 15.9 16.2675C15.21 16.8825 14.31 17.25 13.3125 17.25C12.45 17.25 11.655 16.9725 11.01 16.5C10.5825 16.1925 10.2225 15.795 9.94501 15.3375C9.58501 14.7525 9.375 14.0475 9.375 13.3125C9.375 12.075 9.945 10.9575 10.8525 10.245C11.5275 9.69748 12.39 9.375 13.3125 9.375C14.235 9.375 15.0825 9.69 15.75 10.2225C16.665 10.9425 17.25 12.06 17.25 13.3125Z"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.3125 15.1875C13.3125 14.1525 14.1525 13.3125 15.1875 13.3125C14.1525 13.3125 13.3125 12.4725 13.3125 11.4375C13.3125 12.4725 12.4725 13.3125 11.4375 13.3125C12.4725 13.3125 13.3125 14.1525 13.3125 15.1875Z"
                        stroke="#878787"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                    >
                      Calendar
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/chat"}
                  asChild
                  tooltip="Chat"
                  className="h-11"
                >
                  <Link href="/chat">
                    <MessageCircle
                      size={18}
                      className="shrink-0 text-[#878787]"
                    />
                    <span
                      className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                    >
                      Chat
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/notifications")}
                  asChild
                  tooltip="Notifications"
                  className="h-11"
                >
                  <Link href="/notifications">
                    <span className="relative inline-flex shrink-0">
                      <Bell size={18} className="text-[#878787]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                    >
                      Notifications
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {!isStudentOrAlumni && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/check-in"}
                    asChild
                    tooltip="Register"
                    className="h-11"
                  >
                    <Link href="/check-in">
                      <ClipboardList
                        size={18}
                        className="shrink-0 text-[#878787]"
                      />
                      <span
                        className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                      >
                        Check-in
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === profileHref}
                  asChild
                  tooltip="Profile"
                  className="h-11"
                >
                  <Link href={profileHref}>
                    <User size={18} className="shrink-0 text-[#878787]" />
                    <span
                      className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-50 opacity-100 translate-x-0"
                      }`}
                    >
                      Profile
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {!isStudentOrAlumni && (
                <>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === `${profileHref}/edit-profile`}
                      asChild
                      tooltip="Edit Profile"
                      className="h-11"
                    >
                      <Link href={`${profileHref}/edit-profile`}>
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z"
                            stroke="#878787"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.4083 11.8048L11.7532 14.4598C11.6482 14.5648 11.5508 14.7598 11.5283 14.9023L11.3858 15.9148C11.3333 16.2823 11.5883 16.5373 11.9558 16.4848L12.9682 16.3423C13.1107 16.3198 13.3133 16.2223 13.4108 16.1173L16.0657 13.4623C16.5232 13.0048 16.7407 12.4723 16.0657 11.7973C15.3982 11.1298 14.8658 11.3473 14.4083 11.8048Z"
                            stroke="#878787"
                            strokeWidth={1.5}
                            strokeMiterlimit={10}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.0273 12.1875C14.2523 12.9975 14.8823 13.6275 15.6923 13.8525"
                            stroke="#878787"
                            strokeWidth={1.5}
                            strokeMiterlimit={10}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.55859 16.5C2.55859 13.5975 5.44611 11.25 9.00111 11.25C9.78111 11.25 10.5311 11.3625 11.2286 11.5725"
                            stroke="#878787"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                        >
                          Edit Profile
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname === `${profileHref}/setting`}
                      asChild
                      tooltip="Setting"
                      className="h-11"
                    >
                      <Link href={`${profileHref}/setting`}>
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
                            stroke="#878787"
                            strokeWidth={1.5}
                            strokeMiterlimit={10}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.5 9.66105V8.34105C1.5 7.56105 2.1375 6.91605 2.925 6.91605C4.2825 6.91605 4.8375 5.95605 4.155 4.77855C3.765 4.10355 3.9975 3.22605 4.68 2.83605L5.9775 2.09355C6.57 1.74105 7.335 1.95105 7.6875 2.54355L7.77 2.68605C8.445 3.86355 9.555 3.86355 10.2375 2.68605L10.32 2.54355C10.6725 1.95105 11.4375 1.74105 12.03 2.09355L13.3275 2.83605C14.01 3.22605 14.2425 4.10355 13.8525 4.77855C13.17 5.95605 13.725 6.91605 15.0825 6.91605C15.8625 6.91605 16.5075 7.55355 16.5075 8.34105V9.66105C16.5075 10.4411 15.87 11.0861 15.0825 11.0861C13.725 11.0861 13.17 12.0461 13.8525 13.2236C14.2425 13.9061 14.01 14.7761 13.3275 15.1661L12.03 15.9086C11.4375 16.2611 10.6725 16.0511 10.32 15.4586L10.2375 15.3161C9.5625 14.1386 8.4525 14.1386 7.77 15.3161L7.6875 15.4586C7.335 16.0511 6.57 16.2611 5.9775 15.9086L4.68 15.1661C3.9975 14.7761 3.765 13.8986 4.155 13.2236C4.8375 12.0461 4.2825 11.0861 2.925 11.0861C2.1375 11.0861 1.5 10.4411 1.5 9.66105Z"
                            stroke="#878787"
                            strokeWidth={1.5}
                            strokeMiterlimit={10}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                        >
                          Setting
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroup>

          {canSeeAdministration && (
            <SidebarGroup>
              <SidebarGroupLabel
                className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
              >
                Administration
              </SidebarGroupLabel>
              <SidebarMenu className="flex flex-col gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/user-management"}
                    asChild
                    tooltip="User Management"
                    className="h-11"
                  >
                    <Link href="/user-management">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.4083 11.8048L11.7532 14.4598C11.6482 14.5648 11.5508 14.7598 11.5283 14.9023L11.3858 15.9148C11.3333 16.2823 11.5883 16.5373 11.9558 16.4848L12.9682 16.3423C13.1107 16.3198 13.3133 16.2223 13.4108 16.1173L16.0657 13.4623C16.5232 13.0048 16.7407 12.4723 16.0657 11.7973C15.3982 11.1298 14.8658 11.3473 14.4083 11.8048Z"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.0273 12.1875C14.2523 12.9975 14.8823 13.6275 15.6923 13.8525"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.55859 16.5C2.55859 13.5975 5.44611 11.25 9.00111 11.25C9.78111 11.25 10.5311 11.3625 11.2286 11.5725"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                      >
                        User Management
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/event-management"}
                    asChild
                    tooltip="Event Management"
                    className="h-11"
                  >
                    <Link href="/event-management">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 1.5V3.75"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 1.5V3.75"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.25 9.75H11.25"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.25 12.75H9"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2.625C14.4975 2.76 15.75 3.7125 15.75 7.2375V11.8725C15.75 14.9625 15 16.5075 11.25 16.5075H6.75C3 16.5075 2.25 14.9625 2.25 11.8725V7.2375C2.25 3.7125 3.5025 2.7675 6 2.625H12Z"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                      >
                        Event Management
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/transaction-history"}
                    asChild
                    tooltip="Transaction History"
                    className="h-11"
                  >
                    <Link href="/transaction-history">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.67469 12.3937C7.03469 12.0037 7.5897 12.0337 7.9047 12.4612L8.35471 13.0612C8.70721 13.5337 9.29218 13.5337 9.64468 13.0612L10.0872 12.4688C10.4022 12.0487 10.9572 12.0187 11.3172 12.4012C12.1047 13.2412 12.7422 12.9637 12.7422 11.7862V6.81374C12.7422 5.03624 12.3222 4.59375 10.6572 4.59375H7.32719C5.66219 4.59375 5.24219 5.03624 5.24219 6.81374V11.7862C5.24969 12.9487 5.89469 13.2262 6.67469 12.3937Z"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                      >
                        Transaction History
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/feedback/survey-feedback"}
                    asChild
                    tooltip="Feedback & Polls"
                    className="h-11"
                  >
                    <Link href="/feedback/survey-feedback">
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.16016 13.615V12.0625"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                        <path
                          d="M9 13.6128V10.5078"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                        <path
                          d="M12.8398 13.6103V8.94531"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                        <path
                          d="M12.8402 4.39062L12.4952 4.79562C10.5827 7.03062 8.01766 8.61313 5.16016 9.32563"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                        />
                        <path
                          d="M10.6406 4.39062H12.8381V6.58063"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
                          stroke="#878787"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className={`text-fs-desc text-gray-500 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                      >
                        Feedback & Polls
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              {isStudentOrAlumni ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="cursor-pointer">
                      <div className="relative w-8 h-8 rounded-full shrink-0 bg-grey-200 overflow-visible flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                          {currentUser?.profilePicture ? (
                            <Image
                              src={currentUser.profilePicture}
                              alt={currentUser.name ?? "User"}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="type-desc-small-semibold text-primary uppercase">
                              {currentUser?.avatarInitials ?? "?"}
                            </span>
                          )}
                        </div>
                        <StatusDot status={activeStatus} />
                      </div>
                      <div
                        className={`text-fs-desc text-gray-500 flex flex-col overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                      >
                        <span className="type-detail-semibold text-grey-900 leading-tight">
                          {currentUser?.name ?? "Loading..."}
                        </span>
                        <span className="type-detail-small-medium text-muted-foreground leading-tight">
                          {currentUser?.email ?? ""}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="end"
                    sideOffset={8}
                    className="w-56 mb-2"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={`${profileHref}/edit-profile`}
                        className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-slate-200 focus:bg-slate-200 focus:text-slate-800"
                      >
                        <Pencil size={14} className="text-gray-500" />
                        <span className="text-sm">Edit Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`${profileHref}/setting`}
                        className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-slate-200 focus:bg-slate-200 focus:text-slate-800"
                      >
                        <Settings size={14} className="text-gray-500" />
                        <span className="text-sm">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-200 focus:bg-slate-200 focus:text-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            {(() => {
                              const current = STATUS_OPTIONS.find(
                                (s) => s.value === activeStatus,
                              );
                              return (
                                <>
                                  <span className={`${current?.color}`}>
                                    {current?.icon}
                                  </span>
                                  <span className="text-sm">
                                    {current?.label}
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                          <ChevronRight size={14} className="text-gray-400" />
                        </DropdownMenuItem>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="end"
                        sideOffset={4}
                        className="w-48"
                      >
                        <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                          Set Status
                        </div>
                        {STATUS_OPTIONS.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            className="flex items-center gap-2 cursor-pointer hover:bg-slate-200 focus:bg-slate-200"
                          >
                            <span className={option.color}>{option.icon}</span>
                            <span className="text-sm">{option.label}</span>
                            {activeStatus === option.value && (
                              <span className="ml-auto text-[10px] text-muted-foreground">
                                ✓
                              </span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Logout"
                className="h-11 text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={() => setIsLogoutOpen(true)}
              >
                <LogOut />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${state === "collapsed" ? "max-w-0 opacity-0 -translate-x-2" : "max-w-50 opacity-100 translate-x-0"}`}
                >
                  Logout
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}