"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // CHANGED: Added import for usePathname
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
  const pathname = usePathname(); // CHANGED: Get current route

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // CHANGED: Determine if item or any sub-item is active
          const isItemActive = item.url === pathname || (item.items && item.items.some((subItem) => subItem.url === pathname));
          
          return item.items && item.items.length > 0 ? (
            // 🌿 Collapsible with sub-items
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isItemActive} // CHANGED: Open collapsible if active
              // ORIGINAL: defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.url === pathname} // CHANGED: Set active based on exact URL match
                    // ORIGINAL: No isActive prop
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.url === pathname} // CHANGED: Set active based on URL match
                          // ORIGINAL: No isActive prop
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // 🌱 Direct link without sub-items
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.url === pathname} // CHANGED: Set active based on URL match
                // ORIGINAL: No isActive prop
              >
                <Link href={item.url} className="flex items-center gap-2 w-full">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}