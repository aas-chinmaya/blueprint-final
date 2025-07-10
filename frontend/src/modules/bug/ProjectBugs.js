
// 'use client'

// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchBugByProjectId, resolveBug, clearErrors } from '@/store/features/in-project/bugSlice'
// import { Eye, Bug as BugIcon, Loader2 } from 'lucide-react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Skeleton } from '@/components/ui/skeleton'
// import Pagination from '@/components/ui/Pagination'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { toast } from 'sonner'

// export default function ProjectBugs({ projectId }) {
//   const dispatch = useDispatch()
//   const [page, setPage] = useState(1)
//   const itemsPerPage = 5
//   const [selectedBug, setSelectedBug] = useState(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const { bugsByProjectId, loading, error } = useSelector((state) => ({
//     bugsByProjectId: state.bugs.bugsByProjectId,
//     loading: state.bugs.loading,
//     error: state.bugs.error,
//   }))

//   useEffect(() => {
//     if (projectId) {
//       dispatch(fetchBugByProjectId(projectId)).then((result) => {
//         if (result.error) {
//           toast.error('Failed to fetch bugs: ' + result.error.message)
//         }
//       })
//     }
//   }, [dispatch, projectId])

//   useEffect(() => {
//     return () => {
//       dispatch(clearErrors())
//     }
//   }, [dispatch])

//   const paginatedBugs = bugsByProjectId?.slice(
//     (page - 1) * itemsPerPage,
//     page * itemsPerPage
//   )

//   const handleViewClick = (bug) => {
//     setSelectedBug(bug)
//     setIsModalOpen(true)
//   }

//   const handleModalClose = () => {
//     setIsModalOpen(false)
//     setSelectedBug(null)
//   }

//   const handleResolveBug = (bugId) => {
//     dispatch(resolveBug(bugId)).then((result) => {
//       if (result.error) {
//         toast.error('Failed to resolve bug: ' + result.error.message)
//       } else {
//         toast.success('Bug resolved successfully!')
//         handleModalClose()
//       }
//     })
//   }

//   if (loading.bugsByProjectId) {
//     return (
//       <div className="p-6 space-y-3">
//         {[...Array(5)].map((_, i) => (
//           <Skeleton key={i} className="h-8 w-full rounded-md" />
//         ))}
//       </div>
//     )
//   }

//   if (error.bugsByProjectId) {
//     return (
//       <div className="text-center text-red-600 font-medium py-10">
//         ❌ Error loading bugs: {error.bugsByProjectId}
//       </div>
//     )
//   }

//   if (!bugsByProjectId || bugsByProjectId.length === 0) {
//     return (
//       <div className="text-center text-gray-600 py-10 flex items-center justify-center gap-2">
//         <BugIcon className="w-5 h-5 text-gray-400" />
//         <span>No bugs found for this project.</span>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <div className="overflow-x-auto rounded-lg border shadow-sm">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Bug ID</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Task Ref</TableHead>
//               <TableHead>Assigned To</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Created At</TableHead>
//               <TableHead>View</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedBugs.map((bug) => (
//               <TableRow key={bug._id}>
//                 <TableCell>{bug.bug_id}</TableCell>
//                 <TableCell>{bug.title}</TableCell>
//                 <TableCell>{bug.description}</TableCell>
//                 <TableCell>{bug.taskRef}</TableCell>
//                 <TableCell>{bug.assignedTo}</TableCell>
//                 <TableCell>
//                   <Badge variant={bug.status.toLowerCase() === 'resolved' ? 'default' : 'destructive'}>
//                     {bug.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   {new Date(bug.createdAt).toLocaleString('en-IN', {
//                     dateStyle: 'medium',
//                     timeStyle: 'short',
//                   })}
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleViewClick(bug)}
//                   >
//                     <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <Pagination
//         total={Math.ceil(bugsByProjectId.length / itemsPerPage)}
//         page={page}
//         onChange={(newPage) => setPage(newPage)}
//       />

//       {/* Bug Details Dialog */}
//       <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-blue-800">
//               Bug Details
//             </DialogTitle>
//           </DialogHeader>

//           {selectedBug && (
//             <div className="space-y-5">
//               <h2 className="text-2xl font-bold text-blue-800">
//                 {selectedBug.title}
//               </h2>

//               {error.bugResolve && (
//                 <div className="text-red-500">{error.bugResolve}</div>
//               )}

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <strong>Bug ID:</strong> {selectedBug.bug_id}
//                 </div>
//                 <div>
//                   <strong>Task Ref:</strong> {selectedBug.taskRef}
//                 </div>
//                 <div className="sm:col-span-2">
//                   <strong>Description:</strong>{' '}
//                   {selectedBug.description || 'No description provided'}
//                 </div>
//                 <div>
//                   <strong>Assigned To:</strong> {selectedBug.assignedTo}
//                 </div>
//                 <div>
//                   <strong>Priority:</strong>{' '}
//                   {selectedBug.priority || 'Not specified'}
//                 </div>
//                 <div>
//                   <strong>Status:</strong>{' '}
//                   <Badge variant={selectedBug.status.toLowerCase() === 'resolved' ? 'default' : 'destructive'}>
//                     {selectedBug.status}
//                   </Badge>
//                 </div>
//                 <div>
//                   <strong>Created At:</strong>{' '}
//                   {new Date(selectedBug.createdAt).toLocaleString('en-IN')}
//                 </div>
//                 {selectedBug.resolvedAt && (
//                   <div>
//                     <strong>Resolved At:</strong>{' '}
//                     {new Date(selectedBug.resolvedAt).toLocaleString('en-IN')}
//                   </div>
//                 )}
//               </div>

//               {selectedBug.status.toLowerCase() !== 'resolved' && (
//                 <Button
//                   onClick={() => handleResolveBug(selectedBug.bug_id)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                   disabled={loading.bugResolve}
//                 >
//                   {loading.bugResolve ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     'Resolve Bug'
//                   )}
//                 </Button>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
// src/modules/bug/ProjectBugs.js
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBugByProjectId, resolveBug, clearErrors } from "@/store/features/in-project/bugSlice";
import { Eye, Bug as BugIcon, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/ui/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProjectBugs({ projectId }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedBug, setSelectedBug] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { bugsByProjectId, loading, error } = useSelector((state) => ({
    bugsByProjectId: state.bugs.bugsByProjectId,
    loading: state.bugs.loading,
    error: state.bugs.error,
  }));

  useEffect(() => {
    if (projectId) {
      dispatch(fetchBugByProjectId(projectId)).then((result) => {
        if (result.error) {
          toast.error("Failed to fetch bugs: " + result.error.message);
        }
      });
    }
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, projectId]);

  const paginatedBugs = bugsByProjectId?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
        toast.error("Failed to resolve bug: " + result.error.message);
      } else {
        toast.success("Bug resolved successfully!");
        handleModalClose();
      }
    });
  };

  if (loading.bugsByProjectId) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error.bugsByProjectId) {
    return (
      <div className="text-center text-red-600 font-medium py-10">
        ❌ Error loading bugs: {error.bugsByProjectId}
      </div>
    );
  }

  if (!bugsByProjectId || bugsByProjectId.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10 flex items-center justify-center gap-2">
        <BugIcon className="w-5 h-5 text-gray-400" />
        <span>No bugs found for this project.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bug ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Task Ref</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBugs.map((bug) => (
              <TableRow key={bug._id}>
                <TableCell>{bug.bug_id}</TableCell>
                <TableCell>{bug.title}</TableCell>
                <TableCell>{bug.description}</TableCell>
                <TableCell>{bug.taskRef}</TableCell>
                <TableCell>{bug.assignedTo}</TableCell>
                <TableCell>
                  <Badge
                    variant={bug.status.toLowerCase() === "resolved" ? "default" : "destructive"}
                  >
                    {bug.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(bug.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewClick(bug)}
                  >
                    <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        total={Math.ceil(bugsByProjectId.length / itemsPerPage)}
        page={page}
        onChange={(newPage) => setPage(newPage)}
      />

      {/* Bug Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-800">
              Bug Details
            </DialogTitle>
          </DialogHeader>

          {selectedBug && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-blue-800">{selectedBug.title}</h2>

              {error.bugResolve && (
                <div className="text-red-500">{error.bugResolve}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Bug ID:</strong> {selectedBug.bug_id}
                </div>
                <div>
                  <strong>Task Ref:</strong> {selectedBug.taskRef}
                </div>
                <div className="sm:col-span-2">
                  <strong>Description:</strong>{" "}
                  {selectedBug.description || "No description provided"}
                </div>
                <div>
                  <strong>Assigned To:</strong> {selectedBug.assignedTo}
                </div>
                <div>
                  <strong>Priority:</strong>{" "}
                  {selectedBug.priority || "Not specified"}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Badge
                    variant={selectedBug.status.toLowerCase() === "resolved" ? "default" : "destructive"}
                  >
                    {selectedBug.status}
                  </Badge>
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedBug.createdAt).toLocaleString("en-IN")}
                </div>
                {selectedBug.resolvedAt && (
                  <div>
                    <strong>Resolved At:</strong>{" "}
                    {new Date(selectedBug.resolvedAt).toLocaleString("en-IN")}
                  </div>
                )}
              </div>

              {selectedBug.status.toLowerCase() !== "resolved" && (
                <Button
                  onClick={() => handleResolveBug(selectedBug.bug_id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading.bugResolve}
                >
                  {loading.bugResolve ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Resolve Bug"
                  )}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}