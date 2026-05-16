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
  LayoutDashboard,
  MessageSquareText,
  Settings,
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
  const canSeeAdministration =
    currentUser !== null && ADMIN_ROLES.includes(currentUser.role);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <Image
                src="/images/hrdLogo.webp"
                alt="HRD Event Hub Logo"
                width={32}
                height={32}
                className="w-auto h-8 transition-all duration-500 shrink-0"
              />
              <div className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden">
                <Image
                  src="/images/Logo.webp"
                  alt="HRD Event Hub Text Logo"
                  width={100}
                  height={20}
                  className="w-auto h-4 transition-all duration-500 shrink-0"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-widest uppercase">
            General
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Events" className="h-11">
                <CalendarFold />
                <Link
                  href="/event"
                  className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                >
                  Events
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Group" className="h-11">
                <Users />
                <Link
                  href="/group"
                  className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                >
                  Group
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Calendar" className="h-11">
                <CalendarPlus />
                <Link
                  href="/calendar"
                  className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                >
                  Calendar
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Edit-Profile" className="h-11">
                <UserPen />
                <Link
                  href={"/profile/edit-profile"}
                  className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                >
                  Edit Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Setting" className="h-11">
                <Settings />
                <span className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden">
                  Setting
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {canSeeAdministration && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[12px] font-semibold tracking-widest uppercase group-data-[collapsible=icon]:hidden">
              Administration
            </SidebarGroupLabel>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="User Management" className="h-11">
                  <UserCog />
                  <Link
                    href={"/user-management"}
                    className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                  >
                    User Management
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Event Management" className="h-11">
                  <CalendarRange />
                  <Link
                    href={"/event-management/attendees-list"}
                    className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                  >
                    Event Management
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Transaction History"
                  className="h-11"
                >
                  <Clock />
                  <Link
                    href={"/transaction-history"}
                    className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                  >
                    Transaction History
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Feedback & Polls" className="h-11">
                  <MessageSquareText />
                  <Link
                    href={"/feedback/survey-feedback"}
                    className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden"
                  >
                    Feedback & Polls
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
              <div className="flex flex-col text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden">
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
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                fixedWidth
                className="text-lg"
              />
              <span className="text-lg transition-all duration-200 group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
