"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Phone,
  Briefcase,
  UserRound,
  FolderClosed,
  Settings,
  Tags,
  Layers,
  Clock,
  User,
} from "lucide-react";
import {
  IconDashboard,
  IconPhoneCall,
  IconCalendarEvent,
  IconUser,
  IconFolder,
  IconChecklist,
  IconUsers,
  IconBug,
  IconReportAnalytics,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// ✅ Cleaned nav config
const fullNavData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: IconPhoneCall,
  },
 
  {
    title: "Meeting",
    url: "#",
    icon: IconCalendarEvent,
    items: [
     {
        title: "All Meetings",
        url: "/meetings/all",
      },
      {
        title: "Calendar",
        url: "/meetings/calendar",
      },
      {
        title: "Scheduled",
        url: "/meetings/scheduled",
      },
     
    ],
  },
    {
    title: "Quotation ",
    url: "/quotation",
    icon: IconPhoneCall,
  },
  {
    title: "Master",
    url: "#",
    icon: FolderClosed,
    items: [
      {
        title: "Service",
        url: "/master/services",
      },
      {
        title: "Industry",
        url: "/master/industry",
      },
      {
        title: "Meeting Slots",
        url: "/master/slots",
      },
     
    ],
  },
     {
    title: "Client",
    url: "/client",
    icon: IconUser,
  },
  {
    title: "Project",
    url: "/project",
    icon: IconFolder,
  },
  {
    title: "Team",
    url: "/team",
    icon: IconUsers,
  },
  {
    title: "Task",
    url: "/task",
    icon: IconChecklist,
  },
   // Optional future sections:
  {
    title: "Bug",
    url: "/bug",
    icon: IconBug,
  },
  {
    title: "Report",
    url: "/report",
    icon: IconReportAnalytics,
  },
];

// ✅ Teams dropdown (team-switcher)
const teams = [
  {
    name: "AAS Admin",
    logo: User,
    plan: "Admin Panel",
  },
];

export function AppSidebar(props) {
  return (
    <Sidebar 

    collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={fullNavData} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
