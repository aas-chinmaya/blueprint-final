
// "use client";

// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useParams, useRouter } from "next/navigation";
// import { fetchTaskById, updateTaskStatus } from "@/store/features/TaskSlice";
// import { createBug } from "@/store/features/bugSlice";
// import {
//   ArrowLeft,
//   Calendar,
//   FileText,
//   Clock,
//   Bug,
//   Hash,
//   Briefcase,
//   Mail,
//   UserCheck,
//   AlertCircle,
//   Flag,
// } from "lucide-react";
// import { FiEdit } from "react-icons/fi";

// const ViewTask = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const params = useParams();
//   const task_id = params.id;
//   const task = useSelector((state) => state.task.currentTask);
//   const loading = useSelector((state) => state.task.status === "loading");
//   const error = useSelector((state) => state.task.error);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [bugTitle, setBugTitle] = useState("");
//   const [bugDescription, setBugDescription] = useState("");
//   const [actionType, setActionType] = useState("status");
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     if (task_id) {
//       dispatch(fetchTaskById(task_id));
//     }
//   }, [dispatch, task_id]);

//   useEffect(() => {
//     if (task) {
//       setSelectedStatus(task.status);
//       setIsVisible(true);
//     }
//   }, [task]);

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
//   };

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
//     setActionType("status");
//   };

//   const handleSubmit = async () => {
//     if (actionType === "status") {
//       dispatch(updateTaskStatus({ task_id: task_id, status: selectedStatus }))
//         .unwrap()
//         .then(() => {
//           showToast("Task status updated successfully!", "success");
//         })
//         .catch((err) => {
//           showToast(`Failed to update task status: ${err.message || err}`, "error");
//         });
//     } else if (actionType === "bug") {
//       if (!bugTitle.trim() || !bugDescription.trim()) {
//         showToast("Please provide both a bug title and description.", "error");
//         return;
//       }
//       dispatch(
//         createBug({
//           title: bugTitle,
//           description: bugDescription,
//           task_id: task_id,
//         })
//       )
//         .unwrap()
//         .then(() => {
//           showToast("Bug reported successfully!", "success");
//         })
//         .catch((err) => {
//           showToast(`Failed to report bug: ${err}`, "error");
//         });
//     }
//     closeModal();
//   };

//   const taskStatusStyles = {
//     Pending: "bg-yellow-100 text-yellow-800",
//     "In Progress": "bg-blue-100 text-blue-800",
//     "In Verification": "bg-purple-100 text-purple-800",
//     Completed: "bg-green-100 text-green-800",
//   };

//   const statusOptions = Object.keys(taskStatusStyles);

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-gray-200 shadow-2xl animate-pulse">
//           <div className="flex flex-col items-center">
//             <div className="relative">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
//               <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border border-indigo-300"></div>
//             </div>
//             <p className="mt-6 text-gray-600 font-semibold text-sm">
//               Loading task details...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-bounce">
//         <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-red-200 shadow-2xl">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="w-8 h-8 text-red-600" />
//             </div>
//             <p className="text-red-600 font-semibold text-sm mb-6">
//               Error: {error}
//             </p>
//             <button
//               onClick={() => dispatch(fetchTaskById(task_id))}
//               className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-red-200 transition-all duration-300 hover:scale-105 active:scale-95"
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
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-gray-200 shadow-2xl">
//           <div className="text-center text-gray-600">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FileText className="w-8 h-8 text-gray-400" />
//             </div>
//             <p className="text-sm font-semibold">Task not found</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen relative">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full animate-[float_20s_ease-in-out_infinite]"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/5 rounded-full animate-[float-delayed_25s_ease-in-out_infinite]"></div>
//         <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-400/10 rounded-full animate-[pulse-slow_4s_ease-in-out_infinite]"></div>
//       </div>

//       {/* Toast Notification */}
//       {toast.show && (
//         <div
//           className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white text-sm font-medium animate-[slide-in-right_0.5s_ease-out] ${
//             toast.type === "success"
//               ? "bg-gradient-to-r from-green-600 to-green-500 border border-green-400/20"
//               : "bg-gradient-to-r from-red-600 to-red-500 border border-red-400/20"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-white/80 rounded-full animate-ping"></div>
//             {toast.message}
//           </div>
//         </div>
//       )}

//       {/* Main Container */}
//       <div className="container mx-auto px-4">
//         {/* Main Card */}
//         <div
//           className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-200/50 transition-all duration-700 ${
//             isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
//           }`}
//         >
//           {/* Floating Header */}
//           <div className="flex flex-row items-start sm:items-center justify-between gap-4 p-4 mb-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl">
//             <button
//               onClick={closeViewModal}
//               className="inline-flex items-center gap-3 text-blue-600 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl font-semibold text-sm border border-blue-100 hover:bg-blue-100 transition-all duration-300"
//             >
//               <ArrowLeft className="h-5 w-5" />
//               <span>Back</span>
//             </button>

//             <button
//               onClick={openModal}
//               className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
//             >
//               <FiEdit className="h-5 w-5" />
//               <span>Edit</span>
//             </button>
//           </div>

//           {/* Enhanced Two-Column Layout */}
//           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
//             {/* Left Column: Task Details */}
//             <div className="xl:col-span-7 space-y-6">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-2xl"></div>
//                 <div className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
//                   <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-blue-100 rounded-xl">
//                       <FileText className="h-6 w-6 text-blue-600" />
//                     </div>
//                     Task Details
//                   </h2>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {[
//                       {
//                         label: "Title",
//                         value: task.title,
//                         Icon: Hash,
//                         color: "blue",
//                       },
//                       {
//                         label: "Task ID",
//                         value: task.task_id,
//                         Icon: Hash,
//                         color: "indigo",
//                       },
//                       {
//                         label: "Project ID",
//                         value: task.projectId,
//                         Icon: Briefcase,
//                         color: "purple",
//                       },
//                       {
//                         label: "Project Name",
//                         value: task.projectName,
//                         Icon: FileText,
//                         color: "blue",
//                       },
//                       {
//                         label: "Assigned To",
//                         value: task.assignedTo,
//                         Icon: Mail,
//                         color: "green",
//                       },
//                       {
//                         label: "Assigned By",
//                         value: task.assignedBy,
//                         Icon: UserCheck,
//                         color: "blue",
//                       },
//                       {
//                         label: "Priority",
//                         value: task.priority,
//                         Icon: Flag,
//                         color: "red",
//                       },
//                       {
//                         label: "Deadline",
//                         value: new Date(task.deadline).toLocaleDateString(),
//                         Icon: Calendar,
//                         color: "orange",
//                       },
//                       {
//                         label: "Status",
//                         value: task.status,
//                         Icon: Clock,
//                         color: "blue",
//                       },
//                       {
//                         label: "Review Status",
//                         value: task.reviewStatus,
//                         Icon: AlertCircle,
//                         color: "yellow",
//                       },
//                       {
//                         label: "Created At",
//                         value: new Date(task.createdAt).toLocaleDateString(),
//                         Icon: Calendar,
//                         color: "gray",
//                       },
//                     ].map(({ label, value, Icon, color }, index) => (
//                       <div
//                         key={index}
//                         className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md"
//                       >
//                         <div className="flex items-start gap-3">
//                           <div
//                             className={`p-2 bg-${color}-100 rounded-lg group-hover:bg-${color}-200 transition-colors duration-300`}
//                           >
//                             <Icon className={`h-4 w-4 text-${color}-600`} />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-semibold text-gray-700 mb-1">
//                               {label}
//                             </p>
//                             <p
//                               className={`text-sm font-medium ${
//                                 label === "Status"
//                                   ? `${
//                                       taskStatusStyles[value] || "text-gray-600"
//                                     } px-3 py-1 rounded-full text-xs font-semibold`
//                                   : "text-gray-900"
//                               } break-words`}
//                             >
//                               {value}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Description */}
//             <div className="xl:col-span-5 space-y-6">
//               <div className="relative h-full">
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl"></div>
//                 <div className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 h-full">
//                   <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-gray-100 rounded-xl">
//                       <FileText className="h-6 w-6 text-gray-600" />
//                     </div>
//                     Description
//                   </h2>
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-xl"></div>
//                     <div className="relative text-sm text-gray-700 bg-white/60 backdrop-blur-sm p-6 rounded-xl min-h-[300px] border border-gray-200/50 leading-relaxed">
//                       {task.description || (
//                         <div className="flex items-center justify-center h-full text-gray-400">
//                           <div className="text-center">
//                             <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                             <p>No description available</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 animate-[fade-in_0.3s_ease-out]">
//           <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg border border-gray-200/50 shadow-2xl animate-[scale-in_0.3s_ease-out]">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl"></div>
//               <div className="relative p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 rounded-xl">
//                     <Bug className="h-6 w-6 text-blue-600" />
//                   </div>
//                   Manage Task
//                 </h2>

//                 <div className="space-y-6">
//                   {/* Action Selection */}
//                   <div>
//                     {/* <h3 className="font-semibold text-gray-700 mb-4">
//                       Select Action
//                     </h3> */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       {[
//                         {
//                           value: "status",
//                           label: "Update Status",
//                           desc: "Change task status",
//                         },
//                         {
//                           value: "bug",
//                           label: "Report Bug",
//                           desc: "Report a bug",
//                         },
//                       ].map((action) => (
//                         <label
//                           key={action.value}
//                           className="group cursor-pointer"
//                         >
//                           <div
//                             className={`p-4 rounded-md border-2 transition-all duration-300 ${
//                               actionType === action.value
//                                 ? "border-blue-500 bg-blue-50"
//                                 : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3">
//                               <input
//                                 type="radio"
//                                 name="actionType"
//                                 value={action.value}
//                                 checked={actionType === action.value}
//                                 onChange={() => setActionType(action.value)}
//                                 className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
//                               />
//                               <div>
//                                 <p className="font-semibold text-gray-900">
//                                   {action.label}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                   {action.desc}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Status Update Section */}
//                   {actionType === "status" && (
//                     <div className="animate-[fade-in-up_0.4s_ease-out]">
//                       <label className="font-semibold text-gray-700 block mb-3">
//                         Update Status
//                       </label>
//                       <select
//                         value={selectedStatus}
//                         onChange={(e) => setSelectedStatus(e.target.value)}
//                         className="block w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-gray-300"
//                       >
//                         {statusOptions.map((status) => (
//                           <option key={status} value={status}>
//                             {status}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}

//                   {/* Report Bug Section */}
//                   {actionType === "bug" && (
//                     <div className="animate-[fade-in-up_0.4s_ease-out] space-y-4">
//                       <div>
//                         <label className="font-semibold text-gray-700 block mb-3">
//                           Bug Title
//                         </label>
//                         <input
//                           type="text"
//                           value={bugTitle}
//                           onChange={(e) => setBugTitle(e.target.value)}
//                           className="block w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-gray-300"
//                           placeholder="Enter a concise bug title..."
//                         />
//                       </div>
//                       <div>
//                         <label className="font-semibold text-gray-700 block mb-3">
//                           Bug Description
//                         </label>
//                         <textarea
//                           value={bugDescription}
//                           onChange={(e) => setBugDescription(e.target.value)}
//                           className="block w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-white/80 backdrop-blur-sm text-gray-800 min-h-[120px] transition-all duration-300 hover:border-gray-300 resize-none"
//                           placeholder="Describe the bug in detail..."
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {/* Enhanced Buttons */}
//                   <div className="flex justify-end gap-4 pt-4">
//                     <button
//                       onClick={closeModal}
//                       className="cursor-pointer px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleSubmit}
//                       disabled={
//                         actionType === "bug" &&
//                         (!bugTitle.trim() || !bugDescription.trim())
//                       }
//                       className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-blue-400 transition-all duration-300 hover:scale-105 active:scale-95 disabled:transform-none"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewTask;






"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchTaskById, updateTaskStatus } from "@/store/features/TaskSlice";
import { createBug } from "@/store/features/bugSlice";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  Bug,
  Hash,
  Briefcase,
  Mail,
  UserCheck,
  AlertCircle,
  Flag,
} from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

const ViewTask = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const task_id = params.id;
  const task = useSelector((state) => state.task.currentTask);
  const loading = useSelector((state) => state.task.status === "loading");
  const error = useSelector((state) => state.task.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [actionType, setActionType] = useState("status");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (task_id) {
      dispatch(fetchTaskById(task_id));
    }
  }, [dispatch, task_id]);

  useEffect(() => {
    if (task) {
      setSelectedStatus(task.status);
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
    setActionType("status");
  };

  const handleSubmit = async () => {
    if (actionType === "status") {
      dispatch(updateTaskStatus({ task_id: task_id, status: selectedStatus }))
        .unwrap()
        .then(() => {
          toast.success("Task status updated successfully!");
        })
        .catch((err) => {
          toast.error(`Failed to update task status: ${err.message || err}`);
        });
    } else if (actionType === "bug") {
      if (!bugTitle.trim() || !bugDescription.trim()) {
        toast.error("Please provide both a bug title and description.");
        return;
      }
      dispatch(
        createBug({
          title: bugTitle,
          description: bugDescription,
          task_id: task_id,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Bug reported successfully!");
        })
        .catch((err) => {
          toast.error(`Failed to report bug: ${err}`);
        });
    }
    closeModal();
  };

  const taskStatusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "In Verification": "bg-purple-100 text-purple-800",
    Completed: "bg-green-100 text-green-800",
  };

  const statusOptions = Object.keys(taskStatusStyles);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-gray-200 shadow-2xl animate-pulse">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
              <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border border-indigo-300"></div>
            </div>
            <p className="mt-6 text-gray-600 font-semibold text-sm">
              Loading task details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-bounce">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-red-200 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold text-sm mb-6">
              Error: {error}
            </p>
            <button
              onClick={() => dispatch(fetchTaskById(task_id))}
              className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-red-200 transition-all duration-300 hover:scale-105 active:scale-95"
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
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-gray-200 shadow-2xl">
          <div className="text-center text-gray-600">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold">Task not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full animate-[float_20s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/5 rounded-full animate-[float-delayed_25s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-400/10 rounded-full animate-[pulse-slow_4s_ease-in-out_infinite]"></div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4">
        {/* Main Card */}
        <div
          className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-200/50 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Floating Header */}
          <div className="flex flex-row items-start sm:items-center justify-between gap-4 p-4 mb-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl">
            <button
              onClick={closeViewModal}
              className="inline-flex items-center gap-3 text-blue-600 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl font-semibold text-sm border border-blue-100 hover:bg-blue-100 transition-all duration-300"
            >
              <ArrowLeft classNameirie="h-5 w-5" />
              <span>Back</span>
            </button>

            <button
              onClick={openModal}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
            >
              <FiEdit className="h-5 w-5" />
              <span>Edit</span>
            </button>
          </div>

          {/* Enhanced Two-Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column: Task Details */}
            <div className="xl:col-span-7 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-2xl"></div>
                <div className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    Task Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Title",
                        value: task.title,
                        Icon: Hash,
                        color: "blue",
                      },
                      {
                        label: "Task ID",
                        value: task.task_id,
                        Icon: Hash,
                        color: "indigo",
                      },
                      {
                        label: "Project ID",
                        value: task.projectId,
                        Icon: Briefcase,
                        color: "purple",
                      },
                      {
                        label: "Project Name",
                        value: task.projectName,
                        Icon: FileText,
                        color: "blue",
                      },
                      {
                        label: "Assigned To",
                        value: task.assignedTo,
                        Icon: Mail,
                        color: "green",
                      },
                      {
                        label: "Assigned By",
                        value: task.assignedBy,
                        Icon: UserCheck,
                        color: "blue",
                      },
                      {
                        label: "Priority",
                        value: task.priority,
                        Icon: Flag,
                        color: "red",
                      },
                      {
                        label: "Deadline",
                        value: new Date(task.deadline).toLocaleDateString(),
                        Icon: Calendar,
                        color: "orange",
                      },
                      {
                        label: "Status",
                        value: task.status,
                        Icon: Clock,
                        color: "blue",
                      },
                      {
                        label: "Review Status",
                        value: task.reviewStatus,
                        Icon: AlertCircle,
                        color: "yellow",
                      },
                      {
                        label: "Created At",
                        value: new Date(task.createdAt).toLocaleDateString(),
                        Icon: Calendar,
                        color: "gray",
                      },
                    ].map(({ label, value, Icon, color }, index) => (
                      <div
                        key={index}
                        className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 bg-${color}-100 rounded-lg group-hover:bg-${color}-200 transition-colors duration-300`}
                          >
                            <Icon className={`h-4 w-4 text-${color}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              {label}
                            </p>
                            <p
                              className={`text-sm font-medium ${
                                label === "Status"
                                  ? `${
                                      taskStatusStyles[value] || "text-gray-600"
                                    } px-3 py-1 rounded-full text-xs font-semibold`
                                  : "text-gray-900"
                              } break-words`}
                            >
                              {value}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Description */}
            <div className="xl:col-span-5 space-y-6">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl"></div>
                <div className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 h-full">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-100 rounded-xl">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    Description
                  </h2>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-xl"></div>
                    <div className="relative text-sm text-gray-700 bg-white/60 backdrop-blur-sm p-6 rounded-xl min-h-[300px] border border-gray-200/50 leading-relaxed">
                      {task.description || (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No description available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 animate-[fade-in_0.3s_ease-out]">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg border border-gray-200/50 shadow-2xl animate-[scale-in_0.3s_ease-out]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl"></div>
              <div className="relative p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Bug className="h-6 w-6 text-blue-600" />
                  </div>
                  Manage Task
                </h2>

                <div className="space-y-6">
                  {/* Action Selection */}
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          value: "status",
                          label: "Update Status",
                          desc: "Change task status",
                        },
                        {
                          value: "bug",
                          label: "Report Bug",
                          desc: "Report a bug",
                        },
                      ].map((action) => (
                        <label
                          key={action.value}
                          className="group cursor-pointer"
                        >
                          <div
                            className={`p-4 rounded-md border-2 transition-all duration-300 ${
                              actionType === action.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="actionType"
                                value={action.value}
                                checked={actionType === action.value}
                                onChange={() => setActionType(action.value)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {action.label}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {action.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Update Section */}
                  {actionType === "status" && (
                    <div className="animate-[fade-in-up_0.4s_ease-out]">
                      <label className="font-semibold text-gray-700 block mb-3">
                        Update Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="block w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-gray-300"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Report Bug Section */}
                  {actionType === "bug" && (
                    <div className="animate-[fade-in-up_0.4s_ease-out] space-y-4">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-3">
                          Bug Title
                        </label>
                        <input
                          type="text"
                          value={bugTitle}
                          onChange={(e) => setBugTitle(e.target.value)}
                          className="block w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-gray-300"
                          placeholder="Enter a concise bug title..."
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-3">
                          Bug Description
                        </label>
                        <textarea
                          value={bugDescription}
                          onChange={(e) => setBugDescription(e.target.value)}
                          className="block w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 bg-white/80 backdrop-blur-sm text-gray-800 min-h-[120px] transition-all duration-300 hover:border-gray-300 resize-none"
                          placeholder="Describe the bug in detail..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Enhanced Buttons */}
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      onClick={closeModal}
                      className="cursor-pointer px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        actionType === "bug" &&
                        (!bugTitle.trim() || !bugDescription.trim())
                      }
                      className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-blue-400 transition-all duration-300 hover:scale-105 active:scale-95 disabled:transform-none"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTask;