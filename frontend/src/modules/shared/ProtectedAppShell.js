"use client";
import { AppSidebar } from "@/components/app-sidebar";
import NotificationsPopover from "@/modules/shared/notifications-popover";
import ProfileSheet from "@/modules/shared/ProfileSheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserByEmail } from "@/store/features/shared/userSlice";

export default function ProtectedAppShell({ children }) {
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className=" overflow-x-hidden">
        <header className=" sticky top-0 z-30 flex h-13 shrink-0 items-center px-4  w-full gap-2 bg-white  transition-[width,height] ease-linear shadow-sm group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          {/* className=" flex h-13 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"> */}
          <div className="flex items-center gap-2  w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* <Separator orientation="vertical" className="h-4" /> */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{getPageTitle()}</BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem> */}
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
              {/* <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={!userInfo.profilePicture || "/Avatar.png"}
                    alt={userInfo.fullName || "User"}
                  />
                  <AvatarFallback>
                    {userInfo.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar> */}
              <Avatar>
                <AvatarImage
                  src={
                    typeof user?.image === "string"
                      ? user.image
                      : "/Avatar.png"
                  }
                  alt={user?.name || "User"}
                />
                <AvatarFallback>{userInfo.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </div>
          <ProfileSheet
            open={showProfile}
            onClose={() => setShowProfile(false)}
          />
        </header>

        <div className=" flex flex-1 flex-col gap-4  pt-0">
          <div className=" min-h-[100vh] flex-1  md:min-h-min m-2 overflow-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
