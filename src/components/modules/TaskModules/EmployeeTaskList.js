
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAllTaskByEmployeeId } from '@/store/features/TaskSlice';
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiCalendar,
} from 'react-icons/fi';
import { Briefcase } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input as ShadInput } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Status and priority styling
const statusColors = {
  Planned: 'bg-green-100 text-green-800 border-green-200',
  'In Progress': 'bg-green-200 text-green-900 border-green-300',
  Completed: 'bg-green-300 text-green-900 border-green-400',
};

const statusIcons = {
  Planned: <FiClock className="inline-block mr-1" />,
  'In Progress': <FiAlertCircle className="inline-block mr-1" />,
  Completed: <FiCheckCircle className="inline-block mr-1" />,
};

const priorityColors = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
};

const AllTasksList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { employeeTasks, isLoading, error } = useSelector((state) => state.task);
  const { employeeData, loading: userLoading } = useSelector((state) => state.user);
  const employeeId = employeeData?.employeeID;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewTask, setViewTask] = useState(null);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    if (employeeId) {
      dispatch(getAllTaskByEmployeeId(employeeId));
    }
  }, [dispatch, employeeId]);

  const tasks = employeeTasks?.data || [];

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    planned: tasks.filter((task) => task.status === 'Planned').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
    highPriority: tasks.filter((task) => task.priority === 'High').length,
    mediumPriority: tasks.filter((task) => task.priority === 'Medium').length,
    lowPriority: tasks.filter((task) => task.priority === 'Low').length,
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = () => {
    let filtered = tasks;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((task) => task.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter((task) => task.priority === selectedPriority);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(term) ||
          task.projectName?.toLowerCase().includes(term) ||
          task.assignedBy?.toLowerCase().includes(term) ||
          task.task_id?.toString().includes(term)
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

  const sortedTasks = filteredAndSortedTasks();

  const handleViewTask = (task) => {
    setViewTask(task);
  };

  const handleEditTask = (task) => {
    setEditTask({ ...task });
  };

  const handleSaveEdit = () => {
    console.log('Save edited task:', editTask);
    // Add logic to dispatch an action to update the task in the backend
    setEditTask(null);
  };

  const handleDeleteTask = (taskId) => {
    console.log(`Delete task ${taskId}`);
    // Add logic to dispatch an action to delete the task
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
    setSortField('title');
    setSortDirection('asc');
  };

  const handleCreateTask = () => {
    router.push('/tasks/create');
  };

  if (userLoading || isLoading) {
    return <p className="text-green-600 text-center mt-4">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">My Tasks</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64 md:w-80">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
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
                    <FiFilter />
                    <span className="hidden sm:inline">Filter</span>
                    <FiChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white border-green-200">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Tasks</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {taskStats.total}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('Planned')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 text-green-500" />
                        Planned
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {taskStats.planned}
                      </Badge>
                   

                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('In Progress')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <FiAlertCircle className="mr-1.5 text-green-600" />
                        In Progress
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {taskStats.inProgress}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('Completed')}>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <FiCheckCircle className="mr-1.5 text-green-700" />
                        Completed
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {taskStats.completed}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handlePriorityFilter('all')}>
                    <div className="flex justify-between w-full">
                      <span>All Priorities</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {taskStats.total}
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
                        {taskStats.highPriority}
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
                        {taskStats.mediumPriority}
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
                        {taskStats.lowPriority}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleSort('title')}>
                    <div className="flex justify-between w-full">
                      <span>Task Name</span>
                      {sortField === 'title' &&
                        (sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('task_id')}>
                    <div className="flex justify-between w-full">
                      <span>Task ID</span>
                      {sortField === 'task_id' &&
                        (sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('status')}>
                    <div className="flex justify-between w-full">
                      <span>Status</span>
                      {sortField === 'status' &&
                        (sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('priority')}>
                    <div className="flex justify-between w-full">
                      <span>Priority</span>
                      {sortField === 'priority' &&
                        (sortDirection === 'asc' ? <FiArrowUp className="ml-2" /> : <FiArrowDown className="ml-2" />)}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters} className="justify-center">
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleCreateTask}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <FiPlus />
                <span className="hidden sm:inline">Create Task</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      {sortedTasks.length === 0 ? (
        <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-md border border-green-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <FiCalendar className="text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">No tasks found</h3>
          <p className="text-green-600 mb-6 max-w-md mx-auto">
            {selectedStatus === 'all' && selectedPriority === 'all' && !searchTerm
              ? 'You have no tasks assigned to you.'
              : 'No tasks match your current filters. Try adjusting your search or filter criteria.'}
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
        <div className="mt-6 bg-white rounded-lg shadow-md border border-green-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-50">
                <TableHead
                  className="w-[100px] text-green-800 cursor-pointer"
                  onClick={() => handleSort('task_id')}
                >
                  ID
                  {sortField === 'task_id' &&
                    (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Task Name
                  {sortField === 'title' &&
                    (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Project</TableHead>
                <TableHead className="text-green-800">Assigned By</TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' &&
                    (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Due Date</TableHead>
                <TableHead
                  className="text-green-800 cursor-pointer"
                  onClick={() => handleSort('priority')}
                >
                  Priority
                  {sortField === 'priority' &&
                    (sortDirection === 'asc' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />)}
                </TableHead>
                <TableHead className="text-green-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task._id} className="hover:bg-green-50">
                  <TableCell className="font-medium text-green-900">{task.task_id}</TableCell>
                  <TableCell className="text-green-900">{task.title}</TableCell>
                  <TableCell className="text-green-900">{task.projectName}</TableCell>
                  <TableCell className="text-green-900">{task.assignedBy}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[task.status]} border`}>
                      {statusIcons[task.status]}
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-900">
                    {new Date(task.deadline).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${priorityColors[task.priority]} border`}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:text-green-800 hover:bg-green-100"
                        onClick={() => handleViewTask(task)}
                      >
                        <FiEye className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:text-green-800 hover:bg-green-100"
                        onClick={() => handleEditTask(task)}
                      >
                        <FiEdit className="w-5 h-5" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => handleDeleteTask(task.task_id)}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Task Modal */}
      {viewTask && (
        <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
          <DialogContent className="sm:max-w-[425px] bg-white border-green-200">
            <DialogHeader>
              <DialogTitle className="text-green-800">Task Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">ID</Label>
                <span className="col-span-3 text-green-900">{viewTask.task_id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Task Name</Label>
                <span className="col-span-3 text-green-900">{viewTask.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Description</Label>
                <span className="col-span-3 text-green-900">{viewTask.description}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Project</Label>
                <span className="col-span-3 text-green-900">{viewTask.projectName}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Assigned By</Label>
                <span className="col-span-3 text-green-900">{viewTask.assignedBy}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Status</Label>
                <Badge className={`${statusColors[viewTask.status]} border col-span-3`}>
                  {statusIcons[viewTask.status]}
                  {viewTask.status}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Due Date</Label>
                <span className="col-span-3 text-green-900">
                  {new Date(viewTask.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Priority</Label>
                <Badge className={`${priorityColors[viewTask.priority]} border col-span-3`}>
                  {viewTask.priority}
                </Badge>
              </div>
              {viewTask.completedAt && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-green-700">Completed At</Label>
                  <span className="col-span-3 text-green-900">
                    {new Date(viewTask.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => setViewTask(null)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
          <DialogContent className="sm:max-w-[425px] bg-white border-green-200">
            <DialogHeader>
              <DialogTitle className="text-green-800">Edit Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Task Name</Label>
                <ShadInput
                  className="col-span-3 border-green-300 focus:border-green-500 focus:ring-green-500"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Description</Label>
                <ShadInput
                  className="col-span-3 border-green-300 focus:border-green-500 focus:ring-green-500"
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Project</Label>
                <ShadInput
                  className="col-span-3 border-green-300 focus:border-green-500 focus:ring-green-500"
                  value={editTask.projectName}
                  onChange={(e) => setEditTask({ ...editTask, projectName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Status</Label>
                <Select
                  value={editTask.status}
                  onValueChange={(value) => setEditTask({ ...editTask, status: value })}
                >
                  <SelectTrigger className="col-span-3 border-green-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Due Date</Label>
                <ShadInput
                  type="date"
                  className="col-span-3 border-green-300 focus:border-green-500 focus:ring-green-500"
                  value={editTask.deadline.split('T')[0]}
                  onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-green-700">Priority</Label>
                <Select
                  value={editTask.priority}
                  onValueChange={(value) => setEditTask({ ...editTask, priority: value })}
                >
                  <SelectTrigger className="col-span-3 border-green-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditTask(null)}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AllTasksList;