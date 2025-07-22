// "use client";

// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { fetchTaskById } from "@/features/taskSlice";
// import { createBug } from "@/features/bugSlice";
// import { useLoggedinUser } from "@/hooks/useLoggedinUser";
// import {
//   ArrowLeft,
//   Calendar,
//   FileText,
//   Clock,
//   Bug,
//   Briefcase,
//   Mail,
//   UserCheck,
//   AlertCircle,
//   Flag,
// } from "lucide-react";
// import { FiEdit } from "react-icons/fi";
// import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // ShadCN UI Calendar
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"; // ShadCN UI Popover
// import { format } from "date-fns"; // For formatting dates
// import { CalendarIcon } from "lucide-react"; // For calendar icon in date picker

// const ViewTask = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const params = useParams();
//   const task_id = params.id;
//   const task = useSelector((state) => state.task.currentTask);
//   const loading = useSelector((state) => state.task.status === "loading");
//   const error = useSelector((state) => state.task.error);
//   const { currentUser, isTeamLead } = useLoggedinUser(task?.teamLeadId);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [bugTitle, setBugTitle] = useState("");
//   const [bugDescription, setBugDescription] = useState("");
//   const [bugPriority, setBugPriority] = useState("Medium");
//   const [bugDeadline, setBugDeadline] = useState(null); // Store as Date object
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     if (task_id) {
//       dispatch(fetchTaskById(task_id));
//     }
//   }, [dispatch, task_id]);

//   useEffect(() => {
//     if (task) {
//       setIsVisible(true);
//     }
//   }, [task]);

//   const closeViewModal = () => {
//     setIsVisible(false);
//     setTimeout(() => router.back(), 300);
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setBugTitle("");
//     setBugDescription("");
//     setBugPriority("Medium");
//     setBugDeadline(null); // Reset deadline
//   };

//   const handleSubmit = async () => {
//     if (!bugTitle.trim() || !bugDescription.trim()) {
//       toast.error("Please provide both a bug title and description.");
//       return;
//     }
//     if (!bugDeadline) {
//       toast.error("Please select a deadline for the bug.");
//       return;
//     }
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalize to start of day
//     if (bugDeadline < today) {
//       toast.error("The deadline cannot be in the past.");
//       return;
//     }
//     dispatch(
//       createBug({
//         title: bugTitle,
//         description: bugDescription,
//         task_id: task_id,
//         priority: bugPriority,
//         deadline: format(bugDeadline, "yyyy-MM-dd"), // Format as YYYY-MM-DD
//       })
//     )
//       .unwrap()
//       .then(() => {
//         toast.success("Bug reported successfully!");
//         closeModal();
//       })
//       .catch((err) => {
//         toast.error(`Failed to report bug: ${err}`);
//       });
//   };

//   const isCPC = currentUser?.position === "CPC";
//   const isTeamLead2 = task?.assignedByDetails?.memberId === currentUser?.employeeID;
//   const canReportBug = (isCPC || isTeamLead2) && task?.status === "Completed";

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
//         <Card className="w-full max-w-md">
//           <CardContent className="flex flex-col items-center p-6">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
//             <p className="mt-4 text-muted-foreground font-medium text-base">
//               Loading task details...
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="w-8 h-8 text-red-600" />
//             </div>
//             <p className="text-red-600 font-medium text-base mb-6">
//               Error: {error}
//             </p>
//             <Button
//               onClick={() => dispatch(fetchTaskById(task_id))}
//               variant="destructive"
//               className="inline-flex items-center gap-2"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                 ></path>
//               </svg>
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//               <FileText className="w-8 h-8 text-muted-foreground" />
//             </div>
//             <p className="text-base font-medium text-muted-foreground">
//               Task not found
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-full">
//         <Card
//           className={`w-full transition-all duration-500 ${
//             isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
//           }`}
//         >
//           <CardHeader>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <Button
//                 variant="outline"
//                 onClick={closeViewModal}
//                 className="inline-flex items-center gap-2"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Back
//               </Button>
//               {canReportBug && (
//                 <Button
//                   variant="save"
//                   onClick={openModal}
//                   className="inline-flex items-center gap-2"
//                 >
//                   <FiEdit className="h-4 w-4" />
//                   Report Bug
//                 </Button>
//               )}
//             </div>
//             <CardTitle className="mt-4 text-2xl font-bold flex items-center gap-2">
//               <FileText className="h-6 w-6 text-primary" />
//               {task.title}
//             </CardTitle>
//             <CardDescription className="text-muted-foreground">
//               Task ID: {task.task_id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Task Details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {[
//                   { label: "Project ID", value: task.projectId, Icon: Briefcase, color: "purple" },
//                   { label: "Project Name", value: task.projectName, Icon: FileText, color: "indigo" },
//                   { label: "Assigned To", value: task?.assignedToDetails?.memberName, Icon: Mail, color: "green" },
//                   { label: "Assigned By", value: task.assignedBy, Icon: UserCheck, color: "indigo" },
//                   { label: "Task Priority", value: task.priority, Icon: Flag, color: "red" },
//                   { label: "Deadline", value: new Date(task.deadline).toLocaleDateString(), Icon: Calendar, color: "orange" },
//                   { label: "Status", value: task.status, Icon: Clock, color: "indigo" },
//                   { label: "Review Status", value: task.reviewStatus, Icon: AlertCircle, color: "yellow" },
//                   { label: "Created At", value: new Date(task.createdAt).toLocaleDateString(), Icon: Calendar, color: "gray" },
//                 ].map(({ label, value, Icon, color }, index) => (
//                   <div key={index} className="flex items-start gap-3">
//                     <div className={`p-2 bg-${color}-100 rounded-md`}>
//                       <Icon className={`h-4 w-4 text-${color}-600`} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">{label}</p>
//                       <p className="text-sm font-semibold text-foreground">{value || "N/A"} </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Description</h3>
//               <div className="bg-muted rounded-lg p-4 min-h-[100px] text-sm text-foreground">
//                 {task.description || (
//                   <div className="flex items-center justify-center h-full text-muted-foreground">
//                     <div className="text-center">
//                       <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                       <p>No description available</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//              {/* Review History Section */}
//           <div className="space-y-2">
//             <h3 className="text-lg font-semibold">Review History</h3>
//             {task.taskHistory && task.taskHistory.length > 0 ? (
//               <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden">
//                 {task.taskHistory.map((entry, index) => (
//                   <li key={index} className="p-3 sm:p-4 text-sm text-gray-700 bg-white hover:bg-gray-50 transition">
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="font-medium text-gray-800">{entry.reviewer}</span>
//                       <span className="text-xs text-gray-500">
//                         {new Date(entry.date).toLocaleDateString('en-IN')}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600">{entry.comment}</p>
//                     <span
//                       className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded border 
//                       ${reviewStatusColors[entry.status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
//                     >
//                       {entry.status}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="flex items-center justify-center h-[100px] text-muted-foreground border border-dashed rounded-lg">
//                 <div className="text-center">
//                   <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p>No review history available</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           </CardContent>
//         </Card>



//         {/* Bug Report Modal */}
//         {isModalOpen && (
//           <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//             <DialogContent className="sm:max-w-lg">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Bug className="h-5 w-5 text-primary" />
//                   Report Bug
//                 </DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-muted-foreground mb-1">
//                     Bug Title
//                   </label>
//                   <Input
//                     value={bugTitle}
//                     onChange={(e) => setBugTitle(e.target.value)}
//                     placeholder="Enter bug title..."
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-muted-foreground mb-1">
//                     Bug Description
//                   </label>
//                   <Textarea
//                     value={bugDescription}
//                     onChange={(e) => setBugDescription(e.target.value)}
//                     placeholder="Describe the bug..."
//                     className="min-h-[100px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-muted-foreground mb-1">
//                     Bug Priority
//                   </label>
//                   <Select
//                     value={bugPriority}
//                     onValueChange={setBugPriority}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select priority" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {["Low", "Medium", "High"].map((priority) => (
//                         <SelectItem key={priority} value={priority}>
//                           {priority}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-muted-foreground mb-1">
//                     Bug Deadline
//                   </label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={`w-full justify-start text-left font-normal ${
//                           !bugDeadline && "text-muted-foreground"
//                         }`}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {bugDeadline ? format(bugDeadline, "PPP") : <span>Pick a date</span>}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <CalendarComponent
//                         mode="single"
//                         selected={bugDeadline}
//                         onSelect={setBugDeadline}
//                         initialFocus
//                         disabled={(date) => date < new Date()} // Disable past dates
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={closeModal}>
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   disabled={!bugTitle.trim() || !bugDescription.trim() || !bugDeadline}
//                 >
//                   Submit
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewTask;














"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchTaskById } from "@/features/taskSlice";
import { createBug } from "@/features/bugSlice";
import { useLoggedinUser } from "@/hooks/useLoggedinUser";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  Bug,
  Briefcase,
  Mail,
  UserCheck,
  AlertCircle,
  Flag,
} from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // ShadCN UI Calendar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // ShadCN UI Popover
import { format } from "date-fns"; // For formatting dates
import { CalendarIcon } from "lucide-react"; // For calendar icon in date picker
const reviewStatusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Approved: "bg-green-100 text-green-800 border-green-300",
  Rejected: "bg-red-100 text-red-800 border-red-300",
};
const ViewTask = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const task_id = params.id;
  const task = useSelector((state) => state.task.currentTask);
  const loading = useSelector((state) => state.task.status === "loading");
  const error = useSelector((state) => state.task.error);
  const { currentUser, isTeamLead } = useLoggedinUser(task?.teamLeadId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugPriority, setBugPriority] = useState("Medium");
  const [bugDeadline, setBugDeadline] = useState(null); // Store as Date object
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (task_id) {
      dispatch(fetchTaskById(task_id));
    }
  }, [dispatch, task_id]);

  useEffect(() => {
    if (task) {
      setIsVisible(true);
    }
  }, [task]);

  const closeViewModal = () => {
    setIsVisible(false);
    setTimeout(() => router.back(), 300);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBugTitle("");
    setBugDescription("");
    setBugPriority("Medium");
    setBugDeadline(null); // Reset deadline
  };

  const handleSubmit = async () => {
    if (!bugTitle.trim() || !bugDescription.trim()) {
      toast.error("Please provide both a bug title and description.");
      return;
    }
    if (!bugDeadline) {
      toast.error("Please select a deadline for the bug.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    if (bugDeadline < today) {
      toast.error("The deadline cannot be in the past.");
      return;
    }
    dispatch(
      createBug({
        title: bugTitle,
        description: bugDescription,
        task_id: task_id,
        priority: bugPriority,
        deadline: format(bugDeadline, "yyyy-MM-dd"), // Format as YYYY-MM-DD
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Bug reported successfully!");
        closeModal();
      })
      .catch((err) => {
        toast.error(`Failed to report bug: ${err}`);
      });
  };

  const isCPC = currentUser?.position === "CPC";
  const isTeamLead2 = task?.assignedByDetails?.memberId === currentUser?.employeeID;
  const canReportBug = (isCPC || isTeamLead2) && task?.status === "Completed";

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-muted-foreground font-medium text-base">
              Loading task details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium text-base mb-6">
              Error: {error}
            </p>
            <Button
              onClick={() => dispatch(fetchTaskById(task_id))}
              variant="destructive"
              className="inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-muted-foreground">
              Task not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className=" max-w-full">
      <Card
  className={`w-full transition-all duration-500 ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`}
>
  <CardHeader>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={closeViewModal}
        className="inline-flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      {canReportBug && (
        <Button
          variant="save"
          onClick={openModal}
          className="inline-flex items-center gap-2"
        >
          <FiEdit className="h-4 w-4" />
          Report Bug
        </Button>
      )}
    </div>
    <CardTitle className="mt-4 text-2xl font-bold flex items-center gap-2">
      <FileText className="h-6 w-6 text-primary" />
      {task.title}
    </CardTitle>
    <CardDescription className="text-muted-foreground">
      Task ID: {task.task_id}
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    <div className="grid md:grid-cols-3 gap-6">
      {/* Task Details - Spans 2 columns on md screens */}
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-semibold">Task Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Project ID", value: task.projectId, Icon: Briefcase, color: "purple" },
            { label: "Project Name", value: task.projectName, Icon: FileText, color: "indigo" },
            { label: "Assigned To", value: task?.assignedToDetails?.memberName, Icon: Mail, color: "green" },
            { label: "Assigned By", value: task.assignedBy, Icon: UserCheck, color: "indigo" },
            { label: "Task Priority", value: task.priority, Icon: Flag, color: "red" },
            { label: "Deadline", value: new Date(task.deadline).toLocaleDateString(), Icon: Calendar, color: "orange" },
            { label: "Status", value: task.status, Icon: Clock, color: "indigo" },
            { label: "Review Status", value: task.reviewStatus, Icon: AlertCircle, color: "yellow" },
            { label: "Created At", value: new Date(task.createdAt).toLocaleDateString(), Icon: Calendar, color: "gray" },
          ].map(({ label, value, Icon, color }, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 bg-${color}-100 rounded-md`}>
                <Icon className={`h-4 w-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <div className="bg-muted rounded-lg p-4 min-h-[100px] text-sm text-foreground">
            {task.description || (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No description available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review History - Spans 1 column on md screens */}
   <div className="md:col-span-1 space-y-4">
  <h3 className="text-lg font-semibold">Review History</h3>
  {task.taskHistory && task.taskHistory.length > 0 ? (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden">
      {task.taskHistory.map((entry, index) => (
        <li key={index} className="p-3 sm:p-4 text-sm text-gray-700 bg-white hover:bg-gray-50 transition">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-gray-800">{entry.bug_id}</span>
            <span className="text-xs text-gray-500">
              {new Date(entry.timestamp).toLocaleDateString('en-IN')}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-semibold">Bug Title:</p>
            <p>{entry.bugTitle || 'Untitled'}</p>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <p className="font-semibold">Bug Status:</p>
            <p>{entry.bugStatus || 'Unknown'}</p>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <p className="font-semibold">Action:</p>
            <p>{entry.action}</p>
          </div>
          <span
            className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded border 
            ${reviewStatusColors[entry.reviewStatus?.toUpperCase()] || 'bg-gray-100 text-gray-800 border-gray-300'}`}
          >
            {entry.reviewStatus}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <div className="flex items-center justify-center h-[100px] text-muted-foreground border border-dashed rounded-lg">
      <div className="text-center">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No review history available</p>
      </div>
    </div>
  )}
</div>

    </div>
  </CardContent>
</Card>



        {/* Bug Report Modal */}
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-primary" />
                  Report Bug
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Bug Title
                  </label>
                  <Input
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                    placeholder="Enter bug title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Bug Description
                  </label>
                  <Textarea
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    placeholder="Describe the bug..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Bug Priority
                  </label>
                  <Select
                    value={bugPriority}
                    onValueChange={setBugPriority}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Low", "Medium", "High"].map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Bug Deadline
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !bugDeadline && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bugDeadline ? format(bugDeadline, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={bugDeadline}
                        onSelect={setBugDeadline}
                        initialFocus
                        disabled={(date) => date < new Date()} // Disable past dates
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!bugTitle.trim() || !bugDescription.trim() || !bugDeadline}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ViewTask;