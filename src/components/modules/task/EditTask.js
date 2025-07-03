



'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { fetchTaskById, updateTask } from '@/store/features/TaskSlice';
import { ArrowLeft, FileText, User, Flag, Calendar, CheckCircle, Edit } from 'lucide-react';
import { toast } from "react-toastify";

const EditTask = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const task_id = params.id;
  const task = useSelector((state) => state.task.currentTask);
  const loading = useSelector((state) => state.task.status === 'loading');
  const error = useSelector((state) => state.task.error);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    assignedBy: '',
    priority: 'Low',
    deadline: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (task_id) {
      console.log('Fetching task with ID:', task_id);
      dispatch(fetchTaskById(task_id));
    }
  }, [dispatch, task_id]);

  useEffect(() => {
    if (task) {
      console.log('Fetched task data:', task);
      const formattedDeadline = task.deadline
        ? new Date(task.deadline).toISOString().split('T')[0]
        : '';
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignedTo: task.assignedTo || '',
        assignedBy: task.assignedBy || '',
        priority: task.priority || 'Low',
        deadline: formattedDeadline,
        status: task.status || 'Pending',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!task_id) {
        toast.info('No task_id found');
        return;
      }

      const updatedTask = {
        ...formData,
        task_id: task_id,
      };

      console.log('Updating task:', updatedTask);
      await dispatch(updateTask(updatedTask)).unwrap();
      toast.success('Task updated successfully');
      router.back();
    } catch (error) {
      toast.error('Error  while updating task');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
          <div className="text-center text-gray-600">
            <p className="text-lg font-semibold">Task not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => router.back()}
                className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-full font-medium text-sm transition-all hover:bg-blue-100"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Task</span>
              </button>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
                Edit Task: {task.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Task ID:</span>
              <span className="text-sm font-semibold text-gray-700">{task.task_id}</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <Edit className="h-5 w-5" /> Update Task Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                  <FileText className="h-4 w-4" /> Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                  <User className="h-4 w-4" /> Assigned To
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                  <User className="h-4 w-4" /> Assigned By
                </label>
                <input
                  type="text"
                  name="assignedBy"
                  value={formData.assignedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                  <Flag className="h-4 w-4" /> Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                  <FileText className="h-4 w-4" /> Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                  required
                ></textarea>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                  <Calendar className="h-4 w-4" /> Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                  <CheckCircle className="h-4 w-4" /> Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Verififcation">In Verification</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;