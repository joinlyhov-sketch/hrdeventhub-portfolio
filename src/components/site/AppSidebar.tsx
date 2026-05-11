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
} from "@/components/ui/sidebar";
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
              src="/images/hrdLogo.png"
              alt="HRD Event Hub Logo"
              width={32}
              height={32}
              className="w-auto h-8 transition-all duration-500 shrink-0"
              />
              <div className="flex flex-col leading-tight">
<Image
src="/images/Logo.png"
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
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  fixedWidth
                  className="text-xl"
                />
                <span className="text-lg">Events</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Group" className="h-11">
                <FontAwesomeIcon
                  icon={faUserGroup}
                  fixedWidth
                  className="text-lg"
                />
                <span className="text-lg">Group</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Calendar" className="h-11">
                <FontAwesomeIcon
                  icon={faCalendar}
                  fixedWidth
                  className="text-lg"
                />
                <span className="text-lg">Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Profile"
                className="h-11"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <FontAwesomeIcon icon={faUser} fixedWidth className="text-lg" />
                <span className="text-lg">Profile</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ml-auto text-xs text-muted-foreground transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </SidebarMenuButton>
              {isProfileOpen && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton className="h-10">
                      <FontAwesomeIcon
                        icon={faUserPen}
                        fixedWidth
                        className="text-base"
                      />
                      <span className="text-lg">Edit Profile</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton className="h-10">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        fixedWidth
                        className="text-base"
                      />
                      <span className="text-lg">Setting</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {canSeeAdministration && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[12px] font-semibold tracking-widest uppercase">
              Administration
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Dashboard"
                  className="h-11"
                  onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                >
                  <FontAwesomeIcon
                    icon={faChartColumn}
                    fixedWidth
                    className="text-lg"
                  />
                  <span className="text-lg">Dashboard</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`ml-auto text-xs text-muted-foreground transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                      isDashboardOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>

                {isDashboardOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className="h-10">
                        <FontAwesomeIcon
                          icon={faUserPen}
                          fixedWidth
                          className="text-base"
                        />
                        <span className="text-lg">User Management</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className="h-10">
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          fixedWidth
                          className="text-base"
                        />
                        <span className="text-lg">Event Management</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className="h-10">
                        <FontAwesomeIcon
                          icon={faClock}
                          fixedWidth
                          className="text-base"
                        />
                        <span className="text-lg">Transaction History</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton className="h-10">
                        <FontAwesomeIcon
                          icon={faCommentDots}
                          fixedWidth
                          className="text-base"
                        />
                        <span className="text-lg">Feedback & Polls</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
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
              <div className="flex flex-col">
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
              className="h-11 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                fixedWidth
                className="text-lg"
              />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
