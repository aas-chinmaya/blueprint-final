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
    title: "Blog",
    url: "/blog",
    icon: Phone,
  },
  {
    title: "Services",
    url: "/service",
    icon: Briefcase,
  },
  {
    title: "User",
    url: "/user",
    icon: UserRound,
  },
 
  {
    title: "Master",
    url: "#",
    icon: FolderClosed,
    items: [
      {
        title: "Tags",
        url: "/master/tag",
        icon: Tags,
      },
      {
        title: "Industries",
        url: "/master/service-categories",
        icon: Layers,
      },
      {
        title: "Blog Categories",
        url: "/master/blog-categories",
        icon: FolderClosed,
      },
      {
        title: "Service Technologies",
        url: "/master/service-technology",
        icon: Briefcase,
      },
     
    ],
  },
   {
    title: "Profile",
    url: "/profile",
    icon:  Settings,
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
