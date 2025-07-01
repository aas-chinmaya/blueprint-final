"use client";
import "../globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NotificationsPopover from "@/components/notifications-popover";
import { logoutUser } from "@/store/features/shared/authSlice";
import { fetchUserByEmail } from "@/store/features/shared/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { Providers } from "@/store/providers";
import ProfileDrawer, { SiteHeader } from "@/components/ProfileSheet";
import { Button } from "@headlessui/react";
import { AppShell } from "@/components/ui/app-shell";
export default function RootLayout({ children }) {
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, email } = useSelector((state) => state.auth) || {};
  const {
    userData,
    employeeData,
    loading: userLoading,
  } = useSelector((state) => state.user) || {};

  // Static test user data

  const recipientId = employeeData?.employeeID; // Fallback to a default ID if employeeData is not available

  // Use safe fallbacks
  const userInfo = userData || {};
  const employeeInfo = employeeData || {};

  // Fetch user data on component mount
  useEffect(() => {
    dispatch(fetchUserByEmail());
  }, [dispatch]);

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/")[1];
    if (!path) return "Home";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast(
        "You have been successfully logged out."
      );
      router.push("/");
    } catch (error) {
 
      toast.error(
        error|| "Failed to log out. Please try again."
        
      );
    }
  };
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            {/* LEFT SECTION: Sidebar Trigger + Breadcrumb */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">{getPageTitle()}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* RIGHT SECTION: Notification + Profile */}
            <div className="flex items-center gap-4 ml-auto ">
              <NotificationsPopover recipientId={recipientId} />
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0"
                onClick={() => setShowProfile(true)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={userInfo.profilePicture}
                    alt={userInfo.fullName || "User"}
                  />
                  <AvatarFallback>
                    {userInfo.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
            <ProfileDrawer
              open={showProfile}
              onClose={() => setShowProfile(false)}
            />
          </header>
<div className="bg-muted/50 h-full">

          <AppShell className="">
          {/* <div className="flex flex-1 flex-col gap-4 m-2 rounded-md  pt-0  bg-muted/50 px-2"> */}
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
            {children}
          </AppShell>
</div>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}
