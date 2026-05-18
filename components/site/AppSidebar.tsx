"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faUserGroup,
  faCalendar,
  faUser,
  faChartColumn,
  faUserPen,
  faCalendarDays,
  faClock,
  faCommentDots,
  faArrowRightFromBracket,
  faShieldHalved,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {
  CalendarFold,
  CalendarPlus,
  CalendarRange,
  ChartColumnBig,
  Clock,
  Landmark,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Newspaper,
  Settings,
  SquareArrowRightEnter,
  User,
  UserCog,
  UserPen,
  Users,
} from "lucide-react";
import Link from "next/link";

type Role = "admin" | "organizer" | "student";

type CurrentUser = {
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
};

const MOCK_CURRENT_USER: CurrentUser = {
  name: "Dita Rector",
  email: "RectorDita@gmail.com",
  role: "admin",
  avatarInitials: "PS",
};

const ADMIN_ROLES: Role[] = ["admin", "organizer"];

export function AppSidebar() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser] = useState<CurrentUser | null>(MOCK_CURRENT_USER);
  const { state } = useSidebar();
  const canSeeAdministration =
    currentUser !== null && ADMIN_ROLES.includes(currentUser.role);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={`
                        pointer-events-none
                        transition-all
                        duration-300
                        ease-in-out
                        ${state === "collapsed" ? "justify-center" : "justify-start"}
                      `}
            >
              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    state === "collapsed"
                      ? "w-auto opacity-100 scale-100"
                      : "w-0 hidden scale-75"
                  }
                `}
              >
                <Image
                  src="/images/hrdLogo.webp"
                  alt="HRD Event Hub Logo"
                  width={32}
                  height={32}
                  className="w-auto h-8 shrink-0"
                />
              </div>

              <div
                className={`
                    overflow-hidden
                    transition-all
                    duration-300
                    ease-in-out
                    ${state === "collapsed" ? "w-0 opacity-0" : "w-auto scale-150 opacity-100 ml-4"}
                  `}
              >
                <Image
                  src="/images/Logo.webp"
                  alt="HRD Event Hub Text Logo"
                  width={120}
                  height={24}
                  className="w-auto h-5 shrink-0"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className={`
                transition-all
                duration-300
                ease-in-out
                ${state === "collapsed" ? "justify-center" : "justify-start"}
              `}
            >
              <Link href="/">
                <div
                  className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    state === "collapsed"
                      ? "w-auto opacity-100 scale-100"
                      : "w-0 hidden scale-75"
                  }
                `}
                >
                  <Image
                    src="/images/hrdLogo.webp"
                    alt="HRD Event Hub Logo"
                    width={32}
                    height={32}
                    className="w-auto h-8 shrink-0"
                  />
                </div>

                <div
                  className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    state === "collapsed"
                      ? "w-0 opacity-0"
                      : "w-auto scale-150 opacity-100 ml-4"
                  }
                `}
                >
                  <Image
                    src="/images/Logo.webp"
                    alt="HRD Event Hub Text Logo"
                    width={120}
                    height={24}
                    className="w-auto h-5 shrink-0"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel
            className={`
                        text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
          >
            General
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Events" className="h-11">
                <Link href="/event">
                  <CalendarFold className="text-gray-500" />
                  <span
                    className={`
                      text-fs-desc text-gray-500
                    overflow-hidden
                    whitespace-nowrap
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${
                      state === "collapsed"
                        ? "max-w-0 opacity-0 -translate-x-2"
                        : "max-w-[200px] opacity-100 translate-x-0"
                    }
                  `}
                  >
                    Events
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Group" className="h-11">
                <Link href="/group">
                  <Users className="text-gray-500" />
                  <span
                    className={`
                      text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
                  >
                    Group
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Calendar" className="h-11">
                <Link href="/calendar">
                  <CalendarPlus className="text-gray-500" />
                  <span
                    className={`
                      text-fs-desc text-gray-500
                    overflow-hidden
                    whitespace-nowrap
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${
                      state === "collapsed"
                        ? "max-w-0 opacity-0 -translate-x-2"
                        : "max-w-[200px] opacity-100 translate-x-0"
                    }
                  `}
                  >
                    Calendar
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Event Management"
                className="h-11"
              >
                <Link href="/profile">
                  <User className="text-gray-500" />
                  <span
                    className={`
                      text-fs-desc text-gray-500
                    overflow-hidden
                    whitespace-nowrap
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${
                      state === "collapsed"
                        ? "max-w-0 opacity-0 -translate-x-2"
                        : "max-w-[200px] opacity-100 translate-x-0"
                    }
                  `}
                  >
                    Profile
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Edit-Profile"
                className="h-11"
              >
                <Link href={"/profile/edit-profile"}>
                  <UserPen className="text-gray-500" />
                  <span
                    className={`
                      text-fs-desc text-gray-500
                    overflow-hidden
                    whitespace-nowrap
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${
                      state === "collapsed"
                        ? "max-w-0 opacity-0 -translate-x-2"
                        : "max-w-[200px] opacity-100 translate-x-0"
                    }
                  `}
                  >
                    Edit Profile
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Setting" className="h-11">
                <Link href={"/profile/setting"}>
                  <Settings className="text-gray-500" />
                  <span
                    className={`
                      text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
                  >
                    Setting
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {canSeeAdministration && (
          <SidebarGroup>
            <SidebarGroupLabel
              className={`
                        text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
            >
              Administration
            </SidebarGroupLabel>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="User Management"
                  className="h-11"
                >
                  <Link href="/user-management">
                    <UserCog className="text-gray-500" />
                    <span
                      className={`
                        text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
                    >
                      User Management
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Event Management"
                  className="h-11"
                >
                  <Link href="/event-management/attendees-list">
                    <CalendarRange className="text-gray-500" />
                    <span
                      className={`
                        text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
                    >
                      Event Management
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Transaction History"
                  className="h-11"
                >
                  <Link href="/transaction-history">
                    <Landmark className="text-gray-500" />
                    <span
                      className={`
                        text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
                    >
                      Transaction History
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Feedback & Polls"
                  className="h-11"
                >
                  <Link href="/feedback/survey-feedback">
                    <Newspaper className="text-gray-500" />
                    <span
                      className={`
                        text-fs-desc text-gray-500
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
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
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="w-8 h-8 rounded-full shrink-0 bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {currentUser?.avatarInitials ?? "?"}
              </div>
              <div
                className={`
                        text-fs-desc text-gray-500
                        flex flex-col
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
              >
                <span className="text-sm font-bold leading-tight">
                  {currentUser?.name ?? "Loading..."}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {currentUser?.email ?? ""}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="h-11 text-red-500 hover:text-red-600 hover:bg-red-50 "
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut />
              <span
                className={`
                      overflow-hidden
                      whitespace-nowrap
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${
                        state === "collapsed"
                          ? "max-w-0 opacity-0 -translate-x-2"
                          : "max-w-[200px] opacity-100 translate-x-0"
                      }
                    `}
              >
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
