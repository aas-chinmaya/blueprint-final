





'use client'

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import { X, Phone, Mail, Briefcase, Calendar, Users, DollarSign, LogOut } from "lucide-react"

import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchUserByEmail } from "@/store/features/shared/userSlice"
import { logoutUser } from "@/store/features/shared/authSlice"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function ProfileDrawer({ open, onClose }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const { userData, employeeData } = useSelector((state) => state.user)

  useEffect(() => {
    if (open) dispatch(fetchUserByEmail())
  }, [dispatch, open])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast({ title: "Logged Out", description: "You have been successfully logged out." })
      onClose()
      router.push("/")
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent
        className="min-h-screen w-full max-w-md ml-auto rounded-none border-l bg-background shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <DrawerTitle className="text-lg font-semibold text-gray-800">User Profile</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </DrawerClose>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <Avatar className="h-24 w-24 border shadow">
              <AvatarImage src={userData?.profilePicture || "/Avatar.png"} />
              <AvatarFallback className="text-xl text-gray-800 bg-muted">
                {userData?.fullName?.split(" ").map(n => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{userData?.fullName || "Loading..."}</h2>
              <p className="text-sm text-muted-foreground">{userData?.role || "Employee"}</p>
              <p className="text-sm text-muted-foreground">{userData?.email || "Email not available"}</p>
            </div>
          </div>

          {/* Info Section */}
          <Card className="border border-muted rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <InfoRow icon={<Mail className="text-gray-500" />} label="Email" value={userData?.email} />
                  <InfoRow icon={<Phone className="text-gray-500" />} label="Contact" value={userData?.contact} />
                  <InfoRow icon={<Briefcase className="text-gray-500" />} label="Designation" value={employeeData?.designation} />
                  <InfoRow icon={<Users className="text-gray-500" />} label="Department" value={employeeData?.department} />
                  <InfoRow icon={<Calendar className="text-gray-500" />} label="Joining Date" value={employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : "Not available"} />
                  <InfoRow icon={<DollarSign className="text-gray-500" />} label="CTC" value={employeeData?.ctc ? `₹${employeeData.ctc.toLocaleString()}` : "Not available"} />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t shrink-0">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full flex justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <TableRow>
      <TableCell className="font-medium text-gray-800 w-[40%]">
        <div className="inline-flex items-center gap-2">
          {icon}
          {label}
        </div>
      </TableCell>
      <TableCell className="text-gray-600">{value || "Loading..."}</TableCell>
    </TableRow>
  )
}

