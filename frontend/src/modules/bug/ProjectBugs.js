
// // "use client";

// // import { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchBugByProjectId, resolveBug, clearErrors } from "@/store/features/in-project/bugSlice";
// // import { Eye, Bug as BugIcon, Loader2 } from "lucide-react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import Pagination from "@/components/ui/Pagination";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { toast } from "@/components/ui/sonner";

// // export default function ProjectBugs({ projectId }) {
// //   const dispatch = useDispatch();
// //   const [page, setPage] = useState(1);
// //   const itemsPerPage = 5;
// //   const [selectedBug, setSelectedBug] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   const { bugsByProjectId, loading, error } = useSelector((state) => ({
// //     bugsByProjectId: state.bugs.bugsByProjectId,
// //     loading: state.bugs.loading,
// //     error: state.bugs.error,
// //   }));

// //   useEffect(() => {
// //     if (projectId) {
// //       dispatch(fetchBugByProjectId(projectId)).then((result) => {
// //         if (result.error) {
// //           toast.error("Failed to fetch bugs: " + result.error.message);
// //         }
// //       });
// //     }
// //     return () => {
// //       dispatch(clearErrors());
// //     };
// //   }, [dispatch, projectId]);

// //   const paginatedBugs = bugsByProjectId?.slice(
// //     (page - 1) * itemsPerPage,
// //     page * itemsPerPage
// //   );

// //   const handleViewClick = (bug) => {
// //     setSelectedBug(bug);
// //     setIsModalOpen(true);
// //   };

// //   const handleModalClose = () => {
// //     setIsModalOpen(false);
// //     setSelectedBug(null);
// //   };

// //   const handleResolveBug = (bugId) => {
// //     dispatch(resolveBug(bugId)).then((result) => {
// //       if (result.error) {
// //         toast.error("Failed to resolve bug: " + result.error.message);
// //       } else {
// //         toast.success("Bug resolved successfully!");
// //         handleModalClose();
// //       }
// //     });
// //   };

// //   if (loading.bugsByProjectId) {
// //     return (
// //       <div className="p-6 space-y-3">
// //         {[...Array(5)].map((_, i) => (
// //           <Skeleton key={i} className="h-8 w-full rounded-md" />
// //         ))}
// //       </div>
// //     );
// //   }

// //   if (error.bugsByProjectId) {
// //     return (
// //       <div className="text-center text-red-600 font-medium py-10">
// //         ❌ Error loading bugs: {error.bugsByProjectId}
// //       </div>
// //     );
// //   }

// //   if (!bugsByProjectId || bugsByProjectId.length === 0) {
// //     return (
// //       <div className="text-center text-gray-600 py-10 flex items-center justify-center gap-2">
// //         <BugIcon className="w-5 h-5 text-gray-400" />
// //         <span>No bugs found for this project.</span>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-4">
// //       <div className="overflow-x-auto rounded-lg border shadow-sm">
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>Bug ID</TableHead>
// //               <TableHead>Title</TableHead>
// //               <TableHead>Description</TableHead>
// //               <TableHead>Task Ref</TableHead>
// //               <TableHead>Assigned To</TableHead>
// //               <TableHead>Status</TableHead>
// //               <TableHead>Created At</TableHead>
// //               <TableHead>View</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {paginatedBugs.map((bug) => (
// //               <TableRow key={bug._id}>
// //                 <TableCell>{bug.bug_id}</TableCell>
// //                 <TableCell>{bug.title}</TableCell>
// //                 <TableCell>{bug.description}</TableCell>
// //                 <TableCell>{bug.taskRef}</TableCell>
// //                 <TableCell>{bug.assignedTo}</TableCell>
// //                 <TableCell>
// //                   <Badge
// //                     variant={bug.status.toLowerCase() === "resolved" ? "default" : "destructive"}
// //                   >
// //                     {bug.status}
// //                   </Badge>
// //                 </TableCell>
// //                 <TableCell>
// //                   {new Date(bug.createdAt).toLocaleString("en-IN", {
// //                     dateStyle: "medium",
// //                     timeStyle: "short",
// //                   })}
// //                 </TableCell>
// //                 <TableCell>
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     onClick={() => handleViewClick(bug)}
// //                   >
// //                     <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800" />
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </div>

// //       <Pagination
// //         total={Math.ceil(bugsByProjectId.length / itemsPerPage)}
// //         page={page}
// //         onChange={(newPage) => setPage(newPage)}
// //       />

// //       {/* Bug Details Dialog */}
// //       <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
// //         <DialogContent className="max-w-3xl">
// //           <DialogHeader>
// //             <DialogTitle className="text-xl font-semibold text-blue-800">
// //               Bug Details
// //             </DialogTitle>
// //           </DialogHeader>

// //           {selectedBug && (
// //             <div className="space-y-5">
// //               <h2 className="text-2xl font-bold text-blue-800">{selectedBug.title}</h2>

// //               {error.bugResolve && (
// //                 <div className="text-red-500">{error.bugResolve}</div>
// //               )}

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
// //                 <div>
// //                   <strong>Bug ID:</strong> {selectedBug.bug_id}
// //                 </div>
// //                 <div>
// //                   <strong>Task Ref:</strong> {selectedBug.taskRef}
// //                 </div>
// //                 <div className="sm:col-span-2">
// //                   <strong>Description:</strong>{" "}
// //                   {selectedBug.description || "No description provided"}
// //                 </div>
// //                 <div>
// //                   <strong>Assigned To:</strong> {selectedBug.assignedTo}
// //                 </div>
// //                 <div>
// //                   <strong>Priority:</strong>{" "}
// //                   {selectedBug.priority || "Not specified"}
// //                 </div>
// //                 <div>
// //                   <strong>Status:</strong>{" "}
// //                   <Badge
// //                     variant={selectedBug.status.toLowerCase() === "resolved" ? "default" : "destructive"}
// //                   >
// //                     {selectedBug.status}
// //                   </Badge>
// //                 </div>
// //                 <div>
// //                   <strong>Created At:</strong>{" "}
// //                   {new Date(selectedBug.createdAt).toLocaleString("en-IN")}
// //                 </div>
// //                 {selectedBug.resolvedAt && (
// //                   <div>
// //                     <strong>Resolved At:</strong>{" "}
// //                     {new Date(selectedBug.resolvedAt).toLocaleString("en-IN")}
// //                   </div>
// //                 )}
// //               </div>

// //               {selectedBug.status.toLowerCase() !== "resolved" && (
// //                 <Button
// //                   onClick={() => handleResolveBug(selectedBug.bug_id)}
// //                   className="bg-blue-600 hover:bg-blue-700 text-white"
// //                   disabled={loading.bugResolve}
// //                 >
// //                   {loading.bugResolve ? (
// //                     <Loader2 className="h-4 w-4 animate-spin" />
// //                   ) : (
// //                     "Resolve Bug"
// //                   )}
// //                 </Button>
// //               )}
// //             </div>
// //           )}
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }





// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchBugByProjectId, resolveBug, clearErrors } from "@/store/features/in-project/bugSlice";
// import { Eye, Bug as BugIcon, Loader2 } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import Pagination from "@/components/ui/Pagination";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { toast } from "@/components/ui/sonner";

// export default function ProjectBugs({ projectId }) {
//   const dispatch = useDispatch();
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;
//   const [selectedBug, setSelectedBug] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { bugsByProjectId, loading, error } = useSelector((state) => ({
//     bugsByProjectId: state.bugs.bugsByProjectId || [],
//     loading: state.bugs.loading,
//     error: state.bugs.error,
//   }));

//   useEffect(() => {
//     if (projectId) {
//       dispatch(fetchBugByProjectId(projectId)).then((result) => {
//         if (result.error) {
//           toast.error("Failed to fetch bugs: " + result.error.message);
//         }
//       });
//     }
//     return () => {
//       dispatch(clearErrors());
//     };
//   }, [dispatch, projectId]);

//   const paginatedBugs = bugsByProjectId.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   );
//   const totalPages = Math.ceil(bugsByProjectId.length / itemsPerPage);

//   const handleViewClick = (bug) => {
//     setSelectedBug(bug);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setSelectedBug(null);
//   };

//   const handleResolveBug = (bugId) => {
//     dispatch(resolveBug(bugId)).then((result) => {
//       if (result.error) {
//         toast.error(`Failed to resolve bug: ${result.error.message}`);
//       } else {
//         toast.success("Bug resolved successfully!");
//         handleModalClose();
//       }
//     });
//   };

//   const priorityStyles = {
//     Low: "bg-green-100 text-green-800",
//     Medium: "bg-yellow-100 text-yellow-800",
//     High: "bg-orange-100 text-orange-800",
//     Critical: "bg-red-100 text-red-800",
//   };

//   const statusStyles = {
//     Open: "bg-blue-100 text-blue-800",
//     "In Progress": "bg-purple-100 text-purple-800",
//     Resolved: "bg-green-100 text-green-800",
//     Closed: "bg-gray-100 text-gray-800",
//   };

//   if (loading.bugsByProjectId) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-gray-200 shadow-2xl animate-pulse">
//           <div className="flex flex-col items-center">
//             <div className="relative">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
//               <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border border-indigo-300"></div>
//             </div>
//             <p className="mt-6 text-gray-600 font-semibold text-sm">
//               Loading bug reports...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error.bugsByProjectId) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-bounce">
//         <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-red-200 shadow-2xl">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <BugIcon className="w-8 h-8 text-red-600" />
//             </div>
//             <p className="text-red-600 font-semibold text-sm mb-6">
//               Error: {error.bugsByProjectId}
//             </p>
//             <Button
//               onClick={() => dispatch(fetchBugByProjectId(projectId))}
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
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!bugsByProjectId || bugsByProjectId.length === 0) {
//     return (
//       <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-white rounded-3xl p-8 w-full max-w-sm border border-gray-200 shadow-2xl">
//           <div className="text-center text-gray-600">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <BugIcon className="w-8 h-8 text-gray-400" />
//             </div>
//             <p className="text-sm font-semibold">No bugs found for this project</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen relative p-6">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full animate-[float_20s_ease-in-out_infinite]"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/5 rounded-full animate-[float-delayed_25s_ease-in-out_infinite]"></div>
//         <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-purple-400/10 rounded-full animate-[pulse-slow_4s_ease-in-out_infinite]"></div>
//       </div>

//       <div className="max-w-7xl mx-auto space-y-6">
//         <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-3">
//           <div className="p-2 bg-blue-100 rounded-xl">
//             <BugIcon className="h-6 w-6 text-blue-600" />
//           </div>
//           Project Bug Reports
//         </h1>

//         <div
//           className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-700 animate-[fade-in_0.3s_ease-out]"
//         >
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
//                 <TableHead className="text-blue-800 font-semibold">Bug ID</TableHead>
//                 <TableHead className="text-blue-800 font-semibold">Title</TableHead>
//                 <TableHead className="text-blue-800 font-semibold">Task Ref</TableHead>
//                 <TableHead className="text-blue-800 font-semibold">Priority</TableHead>
//                 <TableHead className="text-blue-800 font-semibold">Status</TableHead>
//                 <TableHead className="text-blue-800 font-semibold">Created At</TableHead>
//                 <TableHead className="text-blue-800 font-semibold">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paginatedBugs.map((bug) => (
//                 <TableRow
//                   key={bug._id}
//                   className="hover:bg-gray-50/50 transition-all duration-300"
//                 >
//                   <TableCell className="font-medium">{bug.bug_id || "N/A"}</TableCell>
//                   <TableCell>{bug.title || "N/A"}</TableCell>
//                   <TableCell>{bug.taskRef || "N/A"}</TableCell>
//                   <TableCell>
//                     <Badge
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         priorityStyles[bug.priority] || "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {bug.priority || "N/A"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         statusStyles[bug.status] || "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {bug.status || "N/A"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     {bug.createdAt
//                       ? new Date(bug.createdAt).toLocaleString("en-IN", {
//                           dateStyle: "medium",
//                           timeStyle: "short",
//                         })
//                       : "N/A"}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleViewClick(bug)}
//                       className="hover:bg-blue-100 transition-all duration-300 hover:scale-105 active:scale-95"
//                     >
//                       <Eye className="h-5 w-5 text-blue-600" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         <Pagination
//           total={totalPages}
//           page={page}
//           onChange={(newPage) => setPage(newPage)}
//         />
//       </div>

//       {/* Bug Details Dialog */}
//       <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
//         <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl animate-[scale-in_0.3s_ease-out]">
//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl"></div>
//             <div className="relative p-6">
//               <DialogHeader>
//                 <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 rounded-xl">
//                     <BugIcon className="h-6 w-6 text-blue-600" />
//                   </div>
//                   Bug Details
//                 </DialogTitle>
//               </DialogHeader>

//               {selectedBug && (
//                 <div className="space-y-6">
//                   <h2 className="text-2xl font-bold text-blue-800">{selectedBug.title || "N/A"}</h2>

//                   {error.bugResolve && (
//                     <div className="text-red-500 text-sm font-medium">
//                       {error.bugResolve}
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                     {[
//                       {
//                         label: "Bug ID",
//                         value: selectedBug.bug_id || "N/A",
//                         color: "blue",
//                       },
//                       {
//                         label: "Task Ref",
//                         value: selectedBug.taskRef || "N/A",
//                         color: "purple",
//                       },
//                       {
//                         label: "Priority",
//                         value: (
//                           <Badge
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               priorityStyles[selectedBug.priority] || "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {selectedBug.priority || "N/A"}
//                           </Badge>
//                         ),
//                         color: "orange",
//                       },
//                       {
//                         label: "Status",
//                         value: (
//                           <Badge
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                               statusStyles[selectedBug.status] || "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {selectedBug.status || "N/A"}
//                           </Badge>
//                         ),
//                         color: "blue",
//                       },
//                       {
//                         label: "Assigned To",
//                         value: selectedBug.assignedTo || "N/A",
//                         color: "green",
//                       },
//                       {
//                         label: "Created At",
//                         value: selectedBug.createdAt
//                           ? new Date(selectedBug.createdAt).toLocaleString("en-IN")
//                           : "N/A",
//                         color: "gray",
//                       },
//                       ...(selectedBug.resolvedAt
//                         ? [
//                             {
//                               label: "Resolved At",
//                               value: new Date(selectedBug.resolvedAt).toLocaleString("en-IN"),
//                               color: "green",
//                             },
//                           ]
//                         : []),
//                       {
//                         label: "Description",
//                         value: selectedBug.description || "No description provided",
//                         color: "gray",
//                         span: true,
//                       },
//                     ].map(({ label, value, color, span }, index) => (
//                       <div
//                         key={index}
//                         className={`group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md ${
//                           span ? "sm:col-span-2" : ""
//                         }`}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div
//                             className={`p-2 bg-${color}-100 rounded-lg group-hover:bg-${color}-200 transition-colors duration-300`}
//                           >
//                             <BugIcon className={`h-4 w-4 text-${color}-600`} />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
//                             <p className="text-sm font-medium text-gray-900 break-words">
//                               {value}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {selectedBug.status.toLowerCase() !== "resolved" && (
//                     <div className="flex justify-end">
//                       <Button
//                         onClick={() => handleResolveBug(selectedBug.bug_id)}
//                         className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={loading.bugResolve}
//                       >
//                         {loading.bugResolve ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           "Resolve Bug"
//                         )}
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }






'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBugByProjectId, resolveBug, clearErrors } from '@/store/features/in-project/bugSlice';
import { Eye, Bug as BugIcon, Loader2, Search, Filter, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { FiX } from 'react-icons/fi';

export default function ProjectBugs({ projectId }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedBug, setSelectedBug] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortField, setSortField] = useState('bug_id');
  const [sortDirection, setSortDirection] = useState('asc');

  const { bugsByProjectId, loading, error } = useSelector((state) => ({
    bugsByProjectId: state.bugs.bugsByProjectId || [],
    loading: state.bugs.loading,
    error: state.bugs.error,
  }));

  useEffect(() => {
    if (projectId) {
      dispatch(fetchBugByProjectId(projectId)).then((result) => {
        if (result.error) {
          toast.error(`Failed to fetch bugs: ${result.error.message}`);
        }
      });
    }
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, projectId]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedStatus, selectedPriority, sortField, sortDirection]);

  // Calculate bug statistics
  const bugStats = {
    total: bugsByProjectId?.length || 0,
    open: bugsByProjectId?.filter((bug) => bug.status.toLowerCase() === 'open').length || 0,
    resolved: bugsByProjectId?.filter((bug) => bug.status.toLowerCase() === 'resolved').length || 0,
    highPriority: bugsByProjectId?.filter((bug) => bug.priority === 'High').length || 0,
    mediumPriority: bugsByProjectId?.filter((bug) => bug.priority === 'Medium').length || 0,
    lowPriority: bugsByProjectId?.filter((bug) => bug.priority === 'Low').length || 0,
  };

  // Filter and sort bugs
  const filteredAndSortedBugs = () => {
    let filtered = bugsByProjectId || [];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((bug) => bug.status.toLowerCase() === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter((bug) => bug.priority === selectedPriority);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bug) =>
          bug.bug_id?.toLowerCase().includes(term) ||
          bug.title?.toLowerCase().includes(term) ||
          bug.description?.toLowerCase().includes(term) ||
          bug.taskRef?.toLowerCase().includes(term)
      );
    }

    return [...filtered].sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      if (sortDirection === 'asc') {
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
      } else {
        return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
      }
    });
  };

  // Pagination logic
  const sortedBugs = filteredAndSortedBugs();
  const totalPages = Math.ceil(sortedBugs.length / itemsPerPage);
  const paginatedBugs = sortedBugs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleViewClick = (bug) => {
    setSelectedBug(bug);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBug(null);
  };

  const handleResolveBug = (bugId) => {
    dispatch(resolveBug(bugId)).then((result) => {
      if (result.error) {
        toast.error(`Failed to resolve bug: ${result.error.message}`);
      } else {
        toast.success('Bug resolved successfully!');
        handleModalClose();
      }
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handlePriorityFilter = (priority) => {
    setSelectedPriority(priority);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSortField('bug_id');
    setSortDirection('asc');
  };

  const priorityStyles = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
    Critical: 'bg-red-200 text-red-900 border-red-300',
  };

  const statusStyles = {
    Open: 'bg-red-100 text-red-800 border-red-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Resolved: 'bg-green-100 text-green-800 border-green-200',
    Closed: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  // Loading state
  if (loading.bugsByProjectId) {
    return (
      <div className="p-6 space-y-4 bg-white rounded-lg shadow-md border border-green-200">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Error state
  if (error.bugsByProjectId) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <BugIcon className="text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Error loading bugs</h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error.bugsByProjectId}</p>
        <Button
          onClick={() => dispatch(fetchBugByProjectId(projectId))}
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
        </Button>
      </div>
    );
  }

  // Empty state
  if (!bugsByProjectId || bugsByProjectId.length === 0) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <BugIcon className="text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">No bugs found</h3>
        <p className="text-green-600 mb-6 max-w-md mx-auto">
          No bugs are available for this project.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BugIcon className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Project Bug Reports</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bugs..."
                  className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                  >
                    <FiX className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Filter />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white border-green-200">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Bugs</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bugStats.total}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('open')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-red-500">●</span>
                        Open
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bugStats.open}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('resolved')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-green-500">●</span>
                        Resolved
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bugStats.resolved}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Priorities</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bugStats.total}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('High')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-red-500">●</span>
                        High
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bugStats.highPriority}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('Medium')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-yellow-500">●</span>
                        Medium
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bugStats.mediumPriority}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('Low')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <span className="mr-1.5 text-green-500">●</span>
                        Low
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {bugStats.lowPriority}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleSort('bug_id')}>
                    <div className="flex justify-between w-full">
                      <span>Bug ID</span>
                      {sortField === 'bug_id' &&
                        (sortDirection === 'asc' ? <ArrowUp className="ml-2" /> : <ArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('title')}>
                    <div className="flex justify-between w-full">
                      <span>Title</span>
                      {sortField === 'title' &&
                        (sortDirection === 'asc' ? <ArrowUp className="ml-2" /> : <ArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('status')}>
                    <div className="flex justify-between w-full">
                      <span>Status</span>
                      {sortField === 'status' &&
                        (sortDirection === 'asc' ? <ArrowUp className="ml-2" /> : <ArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('priority')}>
                    <div className="flex justify-between w-full">
                      <span>Priority</span>
                      {sortField === 'priority' &&
                        (sortDirection === 'asc' ? <ArrowUp className="ml-2" /> : <ArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="justify-center">
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Bugs Table */}
      {paginatedBugs.length === 0 ? (
        <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <BugIcon className="text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">No bugs found</h3>
          <p className="text-green-600 mb-6 max-w-md mx-auto">
            {selectedStatus === 'all' && selectedPriority === 'all' && !searchTerm
              ? 'No bugs are available for this project.'
              : 'No bugs match your current filters. Try adjusting your search or filter criteria.'}
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2 mx-auto border-green-300 text-green-700 hover:bg-green-50"
          >
            <FiX />
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="mt-0 bg-white rounded-lg shadow-md border border-green-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-50">
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('bug_id')}
                >
                  Bug ID
                  {sortField === 'bug_id' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Title
                  {sortField === 'title' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Task Ref</TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('priority')}
                >
                  Priority
                  {sortField === 'priority' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Created At</TableHead>
                <TableHead className="text-green-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBugs.map((bug) => (
                <TableRow key={bug._id} className="hover:bg-green-50">
                  <TableCell className="font-medium text-green-900">{bug.bug_id || 'N/A'}</TableCell>
                  <TableCell className="text-green-900 max-w-xs truncate">{bug.title || 'N/A'}</TableCell>
                  <TableCell className="text-green-900">{bug.taskRef || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={`${priorityStyles[bug.priority] || 'bg-gray-100 text-gray-800 border-gray-200'} border`}>
                      {bug.priority || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusStyles[bug.status] || 'bg-gray-100 text-gray-800 border-gray-200'} border capitalize`}>
                      {bug.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-900">
                    {bug.createdAt
                      ? new Date(bug.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-800 hover:bg-green-100"
                      onClick={() => handleViewClick(bug)}
                      aria-label={`View bug ${bug.bug_id}`}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 mb-10">
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-green-700 ml-4">
                  Bugs per page:
                </label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-24 border-green-400 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="text-green-600 hover:bg-green-100"
                >
                  Previous
                </Button>
                {[...Array(totalPages).keys()].map((p) => (
                  <Button
                    key={p + 1}
                    variant={page === p + 1 ? 'default' : 'outline'}
                    onClick={() => setPage(p + 1)}
                    className={
                      page === p + 1
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'text-green-600 hover:bg-green-100'
                    }
                  >
                    {p + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="text-green-600 hover:bg-green-100"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bug Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px] bg-white border-green-200">
          <DialogHeader>
            <DialogTitle className="text-green-800">Bug Details</DialogTitle>
          </DialogHeader>
          {selectedBug && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Bug ID</label>
                <span className="col-span-3 text-green-900">{selectedBug.bug_id || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Title</label>
                <span className="col-span-3 text-green-900">{selectedBug.title || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Description</label>
                <span className="col-span-3 text-green-900">{selectedBug.description || 'No description provided'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Task Ref</label>
                <span className="col-span-3 text-green-900">{selectedBug.taskRef || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Assigned To</label>
                <span className="col-span-3 text-green-900">{selectedBug.assignedTo || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Priority</label>
                <Badge className={`${priorityStyles[selectedBug.priority] || 'bg-gray-100 text-gray-800 border-gray-200'} border col-span-3`}>
                  {selectedBug.priority || 'N/A'}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Status</label>
                <Badge className={`${statusStyles[selectedBug.status] || 'bg-gray-100 text-gray-800 border-gray-200'} border col-span-3 capitalize`}>
                  {selectedBug.status || 'N/A'}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-green-700">Created At</label>
                <span className="col-span-3 text-green-900">
                  {selectedBug.createdAt ? new Date(selectedBug.createdAt).toLocaleString('en-IN') : 'N/A'}
                </span>
              </div>
              {selectedBug.resolvedAt && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-green-700">Resolved At</label>
                  <span className="col-span-3 text-green-900">
                    {new Date(selectedBug.resolvedAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {error.bugResolve && (
                <div className="col-span-4 text-red-500 text-sm font-medium p-3 bg-red-50 rounded-md">
                  {error.bugResolve}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            {selectedBug?.status.toLowerCase() !== 'resolved' && (
              <Button
                onClick={() => handleResolveBug(selectedBug.bug_id)}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading.bugResolve}
              >
                {loading.bugResolve ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  'Resolve Bug'
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}