
'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBugByEmployeeId,
  resolveBug,
  clearErrors,
} from '@/store/features/in-project/bugSlice'
import { Eye, Bug as BugIcon, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Pagination from '@/components/ui/Pagination'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/sonner'

// Separate selectors for each state property
const selectBugsByEmployeeId = (state) => state.bugs.bugsByEmployeeId
const selectLoading = (state) => state.bugs.loading
const selectError = (state) => state.bugs.error

export default function AllBugByEmployeeId({ employeeId = 'AAS-IA-005-25' }) {
  const dispatch = useDispatch()
  const bugsByEmployeeId = useSelector(selectBugsByEmployeeId)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  
  const [page, setPage] = useState(1)
  const [selectedBug, setSelectedBug] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchBugByEmployeeId(employeeId)).then((result) => {
        if (result.error) {
          toast.error(`Failed to fetch bugs: ${result.error.message}`)
        }
      })
    }
    return () => {
      dispatch(clearErrors())
    }
  }, [dispatch, employeeId])

  const paginatedBugs = bugsByEmployeeId?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const handleViewClick = (bug) => {
    setSelectedBug(bug)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedBug(null)
  }

  const handleResolveBug = (bugId) => {
    dispatch(resolveBug(bugId)).then((result) => {
      if (result.error) {
        toast.error(`Failed to resolve bug: ${result.error.message}`)
      } else {
        toast.success('Bug resolved successfully!')
        handleModalClose()
      }
    })
  }
console.log(bugsByEmployeeId, "bugsByEmployeeId")
  // Loading state
  if (loading.bugsByEmployeeId) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  // Error state
  if (error.bugsByEmployeeId) {
    return (
      <div className="flex items-center justify-center py-12 text-red-600">
        <BugIcon className="w-6 h-6 mr-2" />
        <span className="text-lg font-medium">
          Error loading bugs: {error.bugsByEmployeeId}
        </span>
      </div>
    )
  }

  // Empty state
  if (!bugsByEmployeeId || bugsByEmployeeId.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-600">
        <BugIcon className="w-6 h-6 mr-2 text-gray-400" />
        <span className="text-lg font-medium">
          No bugs assigned to this employee
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Table Container */}
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Bug ID</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Task Ref</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created At</TableHead>
              <TableHead className="font-semibold">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBugs.map((bug) => (
              <TableRow key={bug._id} className="hover:bg-gray-50">
                <TableCell>{bug.bug_id}</TableCell>
                <TableCell className="max-w-xs truncate">{bug.title}</TableCell>
                <TableCell className="max-w-md truncate">{bug.description}</TableCell>
                <TableCell>{bug.taskRef}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      bug.status.toLowerCase() === 'resolved'
                        ? 'success'
                        : 'destructive'
                    }
                    className="capitalize"
                  >
                    {bug.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(bug.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewClick(bug)}
                    aria-label={`View bug ${bug.bug_id}`}
                  >
                    <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        total={Math.ceil(bugsByEmployeeId.length / itemsPerPage)}
        page={page}
        onChange={(newPage) => setPage(newPage)}
      />

      {/* Bug Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Bug Details
            </DialogTitle>
          </DialogHeader>

          {selectedBug && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedBug.title}
              </h3>

              {error.bugResolve && (
                <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-md">
                  {error.bugResolve}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong className="font-medium text-gray-800">Bug ID:</strong>{' '}
                  {selectedBug.bug_id}
                </div>
                <div>
                  <strong className="font-medium text-gray-800">Task Ref:</strong>{' '}
                  {selectedBug.taskRef}
                </div>
                <div className="md:col-span-2">
                  <strong className="font-medium text-gray-800">Description:</strong>{' '}
                  {selectedBug.description || 'No description provided'}
                </div>
                <div>
                  <strong className="font-medium text-gray-800">Assigned To:</strong>{' '}
                  {selectedBug.assignedTo}
                </div>
                <div>
                  <strong className="font-medium text-gray-800">Priority:</strong>{' '}
                  {selectedBug.priority || 'Not specified'}
                </div>
                <div>
                  <strong className="font-medium text-gray-800">Status:</strong>{' '}
                  <Badge
                    variant={
                      selectedBug.status.toLowerCase() === 'resolved'
                        ? 'success'
                        : 'destructive'
                    }
                    className="capitalize"
                  >
                    {selectedBug.status}
                  </Badge>
                </div>
                <div>
                  <strong className="font-medium text-gray-800">Created At:</strong>{' '}
                  {new Date(selectedBug.createdAt).toLocaleString('en-IN')}
                </div>
                {selectedBug.resolvedAt && (
                  <div>
                    <strong className="font-medium text-gray-800">Resolved At:</strong>{' '}
                    {new Date(selectedBug.resolvedAt).toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              {selectedBug.status.toLowerCase() !== 'resolved' && (
                <Button
                  onClick={() => handleResolveBug(selectedBug.bug_id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
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
          )}
        </DialogContent>
      </Dialog>
    </div>
    
  )
}