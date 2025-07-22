"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchTasks,
  fetchTasksByProjectId,
  deleteTask,
  selectTasksByProjectId,
  selectTaskStatus,
  selectTaskError,
} from "@/features/taskSlice";
import { ArrowLeft, Eye, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useLoggedinUser } from "@/hooks/useLoggedinUser";

const AllTaskListByProjectId = ({ projectId, project }) => {
  const { currentUser, isTeamLead } = useLoggedinUser(project?.teamLeadId);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProjectId(projectId));
    }
  }, [dispatch, projectId]);

  const tasks = useSelector((state) =>
    selectTasksByProjectId(state, projectId)
  );

  const status = useSelector(selectTaskStatus);
  const error = useSelector(selectTaskError);

  // console.log('Tasks:', tasks);

  const handleViewTask = (task_id) => {
    router.push(`/task/${task_id}`);
  };

  const handleEditTask = (task_id) => {
    router.push(`/task/edit/${task_id}`);
  };

  const handleDeleteTask = async () => {
    try {
      await dispatch(deleteTask(taskIdToDelete)).unwrap();
      toast.success("Task deleted successfully!");
      setShowDeleteModal(false);
      setTaskIdToDelete(null);
    } catch (err) {
      toast.error(err || "Failed to delete task. Please try again.");
      setShowDeleteModal(false);
      setTaskIdToDelete(null);
    }
  };

  const openDeleteModal = (task_id) => {
    setTaskIdToDelete(task_id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskIdToDelete(null);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          Error: {error}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeDeleteModal}
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
            <div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
              role="dialog"
              aria-labelledby="delete-modal-title"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  id="delete-modal-title"
                  className="text-lg font-bold text-gray-800"
                >
                  Confirm Deletion
                </h3>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close delete confirmation modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label="Cancel deletion"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  aria-label="Confirm task deletion"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table
          className="w-full text-sm text-left text-gray-600"
          role="grid"
          aria-label="Task list"
        >
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                SL. No
              </th>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                Task ID
              </th>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                Title
              </th>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                Assigned To
              </th>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                Priority
              </th>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                Deadline
              </th>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                Status
              </th>
              <th
                className="px-4 py-3 font-semibold uppercase tracking-wider"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(tasks) && tasks.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              Array.isArray(tasks) &&
              tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 transition duration-200"
                  role="row"
                >
                  <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {task.task_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{task.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {task?.assignedToDetails?.memberName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
                        task.priority === "Low"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {task.deadline
                      ? new Date(task.deadline)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
                        task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewTask(task.task_id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        aria-label={`View task ${task.title}`}
                        title="View Task"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {(currentUser?.role === "CPC" || isTeamLead) && (
                        <>
                          <button
                            onClick={() => handleEditTask(task.task_id)}
                            className="text-yellow-600 hover:text-yellow-800 transition-colors cursor-pointer"
                            aria-label={`Edit task ${task.title}`}
                            title="Edit Task"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(task.task_id)}
                            className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                            aria-label={`Delete task ${task.title}`}
                            title="Delete Task"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTaskListByProjectId;
