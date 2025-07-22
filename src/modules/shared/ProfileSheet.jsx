"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Users,
  DollarSign,
  LogOut,
  User2Icon,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserByEmail } from "@/features/shared/userSlice";
import { logoutUser } from "@/features/shared/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileSheet({ open, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, employeeData } = useSelector((state) => state.user);
  useEffect(() => {
    if (open) dispatch(fetchUserByEmail());
  }, [dispatch, open]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("successfully logged out.");
      onClose();
      router.push("/");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-sm sm:max-w-sm md:max-w-md h-full p-0 overflow-hidden"
      >
        <div className="flex flex-col h-full relative">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center gap-3">
             
              <Avatar className="h-24 w-24 ring-4 ring-green-400 shadow-xl">
                <AvatarImage
                  src={!userData?.profilePicture || "/Avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="text-xl text-white bg-gray-400">
                  {userData?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-bold text-blue-900">
                  {userData?.fullName || "Loading..."}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userData?.role || "Employee"}
                </p>
                <p className="text-sm text-gray-600 break-all">
                  {userData?.email || "Email not available"}
                </p>
              </div>
            </div>

            {/* Personal Info Card */}
            <Card className=" ">
              <CardHeader>
                <CardTitle className="text-base text-blue-700">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <Table>
                  <TableBody>
                    <InfoRow
                      icon={<User2Icon className="text-blue-500 w-4 h-4" />}
                      label="Employee Id"
                      value={employeeData?.employeeID}
                    />
                    <InfoRow
                      icon={<Mail className="text-blue-500 w-4 h-4" />}
                      label="Email"
                      value={userData?.email}
                    />
                    <InfoRow
                      icon={<Phone className="text-green-500 w-4 h-4" />}
                      label="Contact"
                      value={userData?.contact}
                    />
                    <InfoRow
                      icon={<Briefcase className="text-indigo-500 w-4 h-4" />}
                      label="Designation"
                      value={employeeData?.designation}
                    />
                 
                   
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Logout Button (fixed bottom) */}
          <div className="p-4 border-t bg-white/90 backdrop-blur-md sticky bottom-0">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="cursor-pointer w-full flex items-center justify-center gap-2 text-base hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <TableRow>
      <TableCell className="font-medium text-gray-800 w-[40%] align-top">
        <div className="flex items-start gap-2">
          {icon}
          <span>{label}</span>
        </div>
      </TableCell>
      <TableCell className="text-gray-600 break-words max-w-[160px]">
        {value || "Loading..."}
      </TableCell>
    </TableRow>
  );
}
