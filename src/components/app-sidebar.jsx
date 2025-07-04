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
import { useSelector } from "react-redux";

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
         {
        title: "Mom Cause",
        url: "/meetings/cause",
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
  // {
  //   title: "Bug",
  //   url: "/bug",
  //   icon: IconBug,
  // },
  // {
  //   title: "Report",
  //   url: "/report",
  //   icon: IconReportAnalytics,
  // },
];

// ✅ Teams dropdown (team-switcher)
const teams = [
  {
    name: "Blueprint",
    logo: User,
    plan: "Project Management",
  },
];

export function AppSidebar(props) {
    const { employeeData } = useSelector((state) => state.user) || {};
  const userRole = employeeData?.designation;

  // Role-based filtering
  const navdata =
    userRole === "cpc"
      ? fullNavData
      : fullNavData.filter((item) =>
          ["Dashboard", "Project", "Task", "Team"].includes(item.title)
        );
  return (
    <Sidebar 

    collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navdata} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
