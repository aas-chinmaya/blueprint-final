





// 'use client'

// import {
//   Drawer,
//   DrawerContent,
//   DrawerTitle,
//   DrawerClose,
// } from "@/components/ui/drawer"

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableRow,
// } from "@/components/ui/table"

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"

// import { Button } from "@/components/ui/button"
// import { X, Phone, Mail, Briefcase, Calendar, Users, DollarSign, LogOut } from "lucide-react"

// import { useDispatch, useSelector } from "react-redux"
// import { useEffect } from "react"
// import { fetchUserByEmail } from "@/store/features/shared/userSlice"
// import { logoutUser } from "@/store/features/shared/authSlice"
// import { useRouter } from "next/navigation"
// import { toast } from "@/components/ui/sonner"

// export default function ProfileDrawer({ open, onClose }) {
//   const dispatch = useDispatch()
//   const router = useRouter()
//   const { userData, employeeData } = useSelector((state) => state.user)

//   useEffect(() => {
//     if (open) dispatch(fetchUserByEmail())
//   }, [dispatch, open])

//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutUser()).unwrap()
//       toast({ title: "Logged Out", description: "You have been successfully logged out." })
//       onClose()
//       router.push("/")
//     } catch (error) {
//       toast({
//         title: "Logout Failed",
//         description: "An error occurred. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <Drawer open={open} onClose={onClose}>
//       <DrawerContent
//         className="min-h-screen w-full max-w-md ml-auto rounded-none border-l bg-background shadow-xl flex flex-col"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
//           <DrawerTitle className="text-lg font-semibold text-gray-800">User Profile</DrawerTitle>
//           <DrawerClose asChild>
//             <Button variant="ghost" size="icon">
//               <X className="h-5 w-5 text-gray-600" />
//             </Button>
//           </DrawerClose>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
//           <div className="flex flex-col items-center text-center gap-3">
//             <Avatar className="h-24 w-24 border shadow">
//               <AvatarImage src={userData?.profilePicture || "/Avatar.png"} />
//               <AvatarFallback className="text-xl text-gray-800 bg-muted">
//                 {userData?.fullName?.split(" ").map(n => n[0]).join("") || "U"}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">{userData?.fullName || "Loading..."}</h2>
//               <p className="text-sm text-muted-foreground">{userData?.role || "Employee"}</p>
//               <p className="text-sm text-muted-foreground">{userData?.email || "Email not available"}</p>
//             </div>
//           </div>

//           {/* Info Section */}
//           <Card className="border border-muted rounded-xl shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-gray-900 text-base">Personal Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableBody>
//                   <InfoRow icon={<Mail className="text-gray-500" />} label="Email" value={userData?.email} />
//                   <InfoRow icon={<Phone className="text-gray-500" />} label="Contact" value={userData?.contact} />
//                   <InfoRow icon={<Briefcase className="text-gray-500" />} label="Designation" value={employeeData?.designation} />
//                   <InfoRow icon={<Users className="text-gray-500" />} label="Department" value={employeeData?.department} />
//                   <InfoRow icon={<Calendar className="text-gray-500" />} label="Joining Date" value={employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : "Not available"} />
//                   <InfoRow icon={<DollarSign className="text-gray-500" />} label="CTC" value={employeeData?.ctc ? `₹${employeeData.ctc.toLocaleString()}` : "Not available"} />
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sticky Footer */}
//         <div className="p-4 border-t shrink-0">
//           <Button
//             variant="destructive"
//             onClick={handleLogout}
//             className="w-full flex justify-center gap-2"
//           >
//             <LogOut className="h-4 w-4" />
//             Sign Out
//           </Button>
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

// function InfoRow({ icon, label, value }) {
//   return (
//     <TableRow>
//       <TableCell className="font-medium text-gray-800 w-[40%]">
//         <div className="inline-flex items-center gap-2">
//           {icon}
//           {label}
//         </div>
//       </TableCell>
//       <TableCell className="text-gray-600">{value || "Loading..."}</TableCell>
//     </TableRow>
//   )
// }


'use client'

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"

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
import {
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Users,
  DollarSign,
  LogOut,
} from "lucide-react"

import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchUserByEmail } from "@/store/features/shared/userSlice"
import { logoutUser } from "@/store/features/shared/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/sonner"

export default function ProfileSheet({ open, onClose }) {
  const dispatch = useDispatch()
  const router = useRouter()
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
                <AvatarImage src={userData?.profilePicture || "/Avatar.png"} />
                <AvatarFallback className="text-xl text-white bg-gray-400">
                  {userData?.fullName?.split(" ").map(n => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-blue-900">{userData?.fullName || "Loading..."}</h2>
                <p className="text-sm text-muted-foreground">{userData?.role || "Employee"}</p>
                <p className="text-sm text-gray-600 break-all">{userData?.email || "Email not available"}</p>
              </div>
            </div>

            {/* Personal Info Card */}
            <Card className="rounded-2xl shadow-md border border-gray-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base text-blue-700">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <Table>
                  <TableBody>
                    <InfoRow icon={<Mail className="text-blue-500 w-4 h-4" />} label="Email" value={userData?.email} />
                    <InfoRow icon={<Phone className="text-green-500 w-4 h-4" />} label="Contact" value={userData?.contact} />
                    <InfoRow icon={<Briefcase className="text-indigo-500 w-4 h-4" />} label="Designation" value={employeeData?.designation} />
                    <InfoRow icon={<Users className="text-pink-500 w-4 h-4" />} label="Department" value={employeeData?.department} />
                    <InfoRow icon={<Calendar className="text-amber-500 w-4 h-4" />} label="Joining Date" value={employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : "Not available"} />
                    <InfoRow icon={<DollarSign className="text-emerald-500 w-4 h-4" />} label="CTC" value={employeeData?.ctc ? `₹${employeeData.ctc.toLocaleString()}` : "Not available"} />
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
              className="w-full flex items-center justify-center gap-2 text-base hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
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
      <TableCell className="text-gray-600 break-words max-w-[160px]">{value || "Loading..."}</TableCell>
    </TableRow>
  )
}
