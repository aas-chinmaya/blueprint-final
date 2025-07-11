
'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBugByEmployeeId,
  resolveBug,
  clearErrors,
} from '@/store/features/in-project/bugSlice'
import { Bug as BugIcon, Loader2, Search, Filter, ChevronDown, ArrowUp, ArrowDown, Eye, UserCheck } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/sonner'
import { FiX } from 'react-icons/fi'
import { useCurrentUser } from '@/hooks/useCurrentUser'

// Status and priority styling
const statusColors = {
  open: 'bg-red-100 text-red-800 border-red-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
}

const priorityColors = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
}

// Separate selectors for each state property
const selectBugsByEmployeeId = (state) => state.bugs.bugsByEmployeeId
const selectLoading = (state) => state.bugs.loading
const selectError = (state) => state.bugs.error
export default function AllBugByEmployeeId() {
  const {currentUser} = useCurrentUser();
  const employeeId = currentUser?.id ; // Use current user's employeeId if available
  const dispatch = useDispatch()
  const bugsByEmployeeId = useSelector(selectBugsByEmployeeId)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [sortField, setSortField] = useState('bug_id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [goToPage, setGoToPage] = useState('')
  const [selectedBug, setSelectedBug] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedPriority, sortField, sortDirection])

  // Calculate bug statistics
  const bugStats = {
    total: bugsByEmployeeId?.length || 0,
    open: bugsByEmployeeId?.filter((bug) => bug.status.toLowerCase() === 'open').length || 0,
    resolved: bugsByEmployeeId?.filter((bug) => bug.status.toLowerCase() === 'resolved').length || 0,
    highPriority: bugsByEmployeeId?.filter((bug) => bug.priority === 'High').length || 0,
    mediumPriority: bugsByEmployeeId?.filter((bug) => bug.priority === 'Medium').length || 0,
    lowPriority: bugsByEmployeeId?.filter((bug) => bug.priority === 'Low').length || 0,
  }

  // Filter and sort bugs
  const filteredAndSortedBugs = () => {
    let filtered = bugsByEmployeeId || []

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((bug) => bug.status.toLowerCase() === selectedStatus)
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter((bug) => bug.priority === selectedPriority)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (bug) =>
          bug.bug_id?.toLowerCase().includes(term) ||
          bug.title?.toLowerCase().includes(term) ||
          bug.description?.toLowerCase().includes(term) ||
          bug.taskRef?.toLowerCase().includes(term)
      )
    }

    return [...filtered].sort((a, b) => {
      const fieldA = a[sortField] || ''
      const fieldB = b[sortField] || ''
      if (sortDirection === 'asc') {
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0
      } else {
        return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0
      }
    })
  }

  // Pagination logic
  const sortedBugs = filteredAndSortedBugs()
  const totalPages = Math.ceil(sortedBugs.length / itemsPerPage)
  const indexOfLastBug = currentPage * itemsPerPage
  const indexOfFirstBug = indexOfLastBug - itemsPerPage
  const currentBugs = sortedBugs.slice(indexOfFirstBug, indexOfLastBug)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleGoToPage = (e) => {
    e.preventDefault()
    const page = parseInt(goToPage, 10)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setGoToPage('')
    } else {
      toast.info(`Please enter a page number between 1 and ${totalPages}.`)
    }
  }

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleStatusFilter = (status) => {
    setSelectedStatus(status)
  }

  const handlePriorityFilter = (priority) => {
    setSelectedPriority(priority)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStatus('all')
    setSelectedPriority('all')
    setSortField('bug_id')
    setSortDirection('asc')
  }

  // Loading state
  if (loading.bugsByEmployeeId) {
    return (
      <div className="p-6 space-y-4 bg-white rounded-lg shadow-md border border-green-200">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  // Error state
  if (error.bugsByEmployeeId) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <BugIcon className="text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Error loading bugs</h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error.bugsByEmployeeId}</p>
      </div>
    )
  }

  // Empty state
  if (!bugsByEmployeeId || bugsByEmployeeId.length === 0) {
    return (
      <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <BugIcon className="text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">No bugs found</h3>
        <p className="text-green-600 mb-6 max-w-md mx-auto">
          {selectedStatus === 'all' && selectedPriority === 'all' && !searchTerm
            ? 'No bugs are assigned to this employee.'
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
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BugIcon className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Assigned Issues</h1>
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
      {currentBugs.length === 0 ? (
        <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <BugIcon className="text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">No bugs found</h3>
          <p className="text-green-600 mb-6 max-w-md mx-auto">
            {selectedStatus === 'all' && selectedPriority === 'all' && !searchTerm
              ? 'No bugs are assigned to this employee.'
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
                  className="w-[100px] text-green-800 cursor-pointer"
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
                <TableHead className="text-green-800">Description</TableHead>
                <TableHead className="text-green-800">Task Ref</TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Created At</TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('priority')}
                >
                  Priority
                  {sortField === 'priority' &&
                    (sortDirection === 'asc' ? <ArrowUp className="inline ml-1" /> : <ArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBugs.map((bug) => (
                <TableRow key={bug._id} className="hover:bg-green-50">
                  <TableCell className="font-medium text-green-900">{bug.bug_id}</TableCell>
                  <TableCell className="text-green-900 max-w-xs truncate">{bug.title}</TableCell>
                  <TableCell className="text-green-900 max-w-md truncate">{bug.description}</TableCell>
                  <TableCell className="text-green-900">{bug.taskRef}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[bug.status.toLowerCase()]} border capitalize`}>
                      {bug.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-900">
                    {new Date(bug.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${priorityColors[bug.priority]} border`}>{bug.priority}</Badge>
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
                <Label htmlFor="itemsPerPage" className="text-green-700 ml-4">Bugs per page:</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-24 border-green-400 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-green-600 hover:bg-green-100"
                >
                  Previous
                </Button>
                {[...Array(totalPages).keys()].map((page) => (
                  <Button
                    key={page + 1}
                    variant={currentPage === page + 1 ? 'default' : 'outline'}
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      currentPage === page + 1
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'text-green-600 hover:bg-green-100'
                    }
                  >
                    {page + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-green-600 hover:bg-green-100"
                >
                  Next
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="goToPage" className="text-green-700">Go to page:</Label>
                <Input
                  id="goToPage"
                  type="number"
                  value={goToPage}
                  onChange={(e) => setGoToPage(e.target.value)}
                  className="w-20 border-green-400 focus:ring-green-500"
                  placeholder="Page"
                />
                <Button
                  onClick={handleGoToPage}
                  className="bg-green-600 hover:bg-green-700 text-white mr-4"
                >
                  Go
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
          {
            console.log(selectedBug)
          }
          {selectedBug && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Bug ID</Label>
                <span className="col-span-3 text-green-900">{selectedBug.bug_id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Title</Label>
                <span className="col-span-3 text-green-900">{selectedBug.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Description</Label>
                <span className="col-span-3 text-green-900">{selectedBug.description || 'No description provided'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Task Ref</Label>
                <span className="col-span-3 text-green-900">{selectedBug.taskRef}</span>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Project Id</Label>
                <span className="col-span-3 text-green-900">{selectedBug.projectId}</span>
               
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Assigned To</Label>
                <span className="col-span-3 text-green-900">{selectedBug.assignedTo}</span>
              </div>
              {/* Assigned To with "Me" */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Assigned To</Label>
                <div className="col-span-3 flex items-center gap-3 text-green-900">
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-xl shadow-sm">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm">{selectedBug.assignedTo}</span>

                    {selectedBug.assignedTo === currentUser.id && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-600 text-white font-semibold shadow-md">
                        Me
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Status</Label>
                <Badge className={`${statusColors[selectedBug.status.toLowerCase()]} border col-span-3 capitalize`}>
                  {selectedBug.status}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Priority</Label>
                <Badge className={`${priorityColors[selectedBug.priority]} border col-span-3`}>
                  {selectedBug.priority}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Created At</Label>
                <span className="col-span-3 text-green-900">
                  {new Date(selectedBug.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              {selectedBug.resolvedAt && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-green-700">Resolved At</Label>
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
          <DialogFooter>
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
          
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}








