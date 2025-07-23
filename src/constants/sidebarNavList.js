

// import {
//   LayoutDashboard,
//   PhoneCall,
//   CalendarDays,
//   User,
//   Folder,
//   Users,
//   ListChecks,
//   Bug,
//   FolderClosed,
//   FileText,
// } from 'lucide-react';

// export const fullNav = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: LayoutDashboard,
//     roles: ["cpc", "employee"],
//   },
//   {
//     title: "Contact",
//     url: "/contact",
//     icon: PhoneCall,
//     roles: ["cpc"],
//   },
//   {
//     title: "Meeting",
//     url: "#",
//     icon: CalendarDays,
//     roles: ["cpc"],
//     items: [
//       { title: "Client Meeting", url: "/meetings/all", roles: ["cpc"] },
//       { title: "Meeting Calendar", url: "/meetings/calendar", roles: ["cpc"] },
//       // { title: "Team Calendar", url: "/meetings/team-calendar", roles: ["cpc","employee"] },
//       { title: "MOM Dashboard", url: "/meetings/mom", roles: ["cpc"] },
//       { title: "Cause Dashboard", url: "/meetings/cause", roles: ["cpc"] },
//     ],
//   },
//   {
//     title: "Quotation",
//     url: "/quotation",
//     icon: FileText,
//     roles: ["cpc"],
//   },
//   {
//     title: "Client",
//     url: "/client",
//     icon: User,
//     roles: ["cpc"],
//   },
//   {
//     title: "Project",
//     url: "/project",
//     icon: Folder,
//     roles: ["cpc", "employee"],
//   },
//   {
//     title: "Team",
//     url: "/team",
//     icon: Users,
//     roles: ["cpc", "employee"],
//   },
//   {
//     title: "Task",
//     url: "/task",
//     icon: ListChecks,
//     roles: ["cpc", "employee"],
//   },
 

//   {
//     title: "Bug",
//     url: "/bug",
//     icon: Bug,
//     roles: ["cpc"],
   
//   },

//   {
//     title: "Bug",
//     url: "/bug/assigned-bugs",
//     icon: Bug,
//     roles: ["employee"],
   
//   },
//   // {
//   //   title: "Bug",
//   //   url: "#",
//   //   icon: Bug,
//   //   roles: ["cpc", "employee"],
//   //    items: [
//   //     { title: "All Bug", url: "/bug", roles: ["cpc"] },
//   //     { title: "Assigned Bug", url: "/bug/assigned-bugs", roles: ["employee"] },
   
//   //   ],
//   // },
//   {
//     title: "Master",
//     url: "#",
//     icon: FolderClosed,
//     roles: ["cpc"],
//     items: [
//       { title: "Service", url: "/master/services", roles: ["cpc"] },
//       { title: "Industry", url: "/master/industry", roles: ["cpc"] },
//       { title: "Meeting Slots", url: "/master/slots", roles: ["cpc"] },
//     ],
//   },
// ];












// src/constants/sidebarNavList.js
import {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  User,
  Folder,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
} from "lucide-react";

export const iconMap = {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  User,
  Folder,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
};

export const fullNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["cpc", "employee"],
  },
  {
    title: "Contact",
    url: "/contact",
    icon: "PhoneCall",
    roles: ["cpc"],
  },
  {
    title: "Meeting",
    url: "#",
    icon: "CalendarDays",
    roles: ["cpc"],
    items: [
      { title: "Client Meeting", url: "/meetings/all", roles: ["cpc"] },
      { title: "Meeting Calendar", url: "/meetings/calendar", roles: ["cpc"] },
      { title: "MOM Dashboard", url: "/meetings/mom", roles: ["cpc"] },
      { title: "Cause Dashboard", url: "/meetings/cause", roles: ["cpc"] },
    ],
  },
  {
    title: "Quotation",
    url: "/quotation",
    icon: "FileText",
    roles: ["cpc"],
  },
  {
    title: "Client",
    url: "/client",
    icon: "User",
    roles: ["cpc"],
  },
  {
    title: "Project",
    url: "/project",
    icon: "Folder",
    roles: ["cpc", "employee"],
  },
  {
    title: "Team",
    url: "/team",
    icon: "Users",
    roles: ["cpc", "employee"],
  },
  {
    title: "Task",
    url: "/task",
    icon: "ListChecks",
    roles: ["cpc", "employee"],
  },
  {
    title: "Bug",
    url: "/bug",
    icon: "Bug",
    roles: ["cpc"],
  },
  {
    title: "Bug",
    url: "/bug/assigned-bugs",
    icon: "Bug",
    roles: ["employee"],
  },
  {
    title: "Master",
    url: "#",
    icon: "FolderClosed",
    roles: ["cpc"],
    items: [
      { title: "Service", url: "/master/services", roles: ["cpc"] },
      { title: "Industry", url: "/master/industry", roles: ["cpc"] },
      { title: "Meeting Slots", url: "/master/slots", roles: ["cpc"] },
    ],
  },
];

