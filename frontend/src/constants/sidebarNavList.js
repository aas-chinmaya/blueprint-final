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
} from 'lucide-react';

export const fullNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["cpc", "employee"],
  },
  {
    title: "Contact",
    url: "/contact",
    icon: PhoneCall,
    roles: ["cpc"],
  },
  {
    title: "Meeting",
    url: "#",
    icon: CalendarDays,
    roles: ["cpc", "employee"],
    items: [
      { title: "Client Meeting", url: "/meetings/all", roles: ["cpc"] },
      { title: "Meeting Calendar", url: "/meetings/calendar", roles: ["cpc"] },
      { title: "Team Meeting calendar", url: "/meetings/team-calendar", roles: ["employee","cpc"] },
      { title: "Mom Cause", url: "/meetings/cause", roles: ["cpc"] },
    ],
  },
  {
    title: "Quotation",
    url: "/quotation",
    icon: PhoneCall,
    roles: ["cpc"],
  },
  {
    title: "Client",
    url: "/client",
    icon: User,
    roles: ["cpc"],
  },
  {
    title: "Project",
    url: "/project",
    icon: Folder,
    roles: ["cpc", "employee"],
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
    roles: ["cpc",, "employee"],
  },
  {
    title: "Task",
    url: "/task",
    icon: ListChecks,
    roles: ["cpc", "employee"],
  },
  {
    title: "Bug",
    url: "#",
    icon: Bug,
    roles: ["cpc", "employee"],
     items: [
      { title: "All Bug", url: "/bug", roles: ["cpc"] },
      { title: "Assigned Bug", url: "/bug/assigned-bugs", roles: ["employee"] },
   
    ],
  },
  {
    title: "Master",
    url: "#",
    icon: FolderClosed,
    roles: ["cpc"],
    items: [
      { title: "Service", url: "/master/services", roles: ["cpc"] },
      { title: "Industry", url: "/master/industry", roles: ["cpc"] },
      { title: "Meeting Slots", url: "/master/slots", roles: ["cpc"] },
    ],
  },
];




export const getSidebarForRole = (role) => {
  return fullNav
    .filter(item => item.roles.includes(role))
    .map(item => {
      if (item.items) {
        const filteredSubItems = item.items.filter(sub => sub.roles.includes(role));
        return { ...item, items: filteredSubItems };
      }
      return item;
    });
}