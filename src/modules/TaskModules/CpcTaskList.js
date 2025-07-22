


'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllTaskList,
  selectAllTaskList,
  selectTaskStatus,
} from '@/features/taskSlice';

import KanbanView from '@/components/kanban/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { FiEye, FiLayout, FiList } from 'react-icons/fi';

export default function Task() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTaskList);
  const status = useSelector(selectTaskStatus);

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [viewTask, setViewTask] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllTaskList());
    }
  }, [status, dispatch]);

  const kanbanConfig = {
    groupBy: 'status',
    groupOrder: ['Planned','Pending', 'In Progress', 'Completed'],
    fields: {
      title: 'title',
      description: 'description',
      badge: 'priority',
    },
  };

  const switchView = (mode) => setViewMode(mode);

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            onClick={() => switchView('kanban')}
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'border'}`}
          >
            <FiLayout />
            Kanban
          </Button>
          <Button
            onClick={() => switchView('table')}
            variant={viewMode === 'table' ? 'default' : 'outline'}
            className={`flex items-center gap-2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'border'}`}
          >
            <FiList />
            Table
          </Button>
        </div>
      </div>

      {/* Dynamic View Rendering */}
      {viewMode === 'kanban' ? (
        <KanbanView
          data={tasks}
          config={kanbanConfig}
          onView={(task) => setViewTask(task)}
        />
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.task_id}>
                  <TableCell>{task.task_id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{task.projectId || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewTask(task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEye />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Modal */}
      {viewTask && (
        <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
          <DialogContent className="bg-white border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-black">Task Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2 text-black">
              <div className="flex justify-between">
                <Label>ID:</Label>
                <span>{viewTask.task_id}</span>
              </div>
              <div className="flex justify-between">
                <Label>Title:</Label>
                <span>{viewTask.title}</span>
              </div>
              <div className="flex justify-between">
                <Label>Description:</Label>
                <span>{viewTask.description || 'No description'}</span>
              </div>
              <div className="flex justify-between">
                <Label>Status:</Label>
                <Badge variant="outline">{viewTask.status}</Badge>
              </div>
              <div className="flex justify-between">
                <Label>Priority:</Label>
                <Badge variant="outline">{viewTask.priority}</Badge>
              </div>
              <div className="flex justify-between">
                <Label>Project:</Label>
                <span>{viewTask.projectId || 'N/A'}</span>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setViewTask(null)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
