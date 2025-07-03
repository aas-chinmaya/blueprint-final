




'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, changeProjectStatus, resetSuccessMessage } from '@/store/features/projectSlice'; // Corrected import
import {
  FiArrowLeft,
  FiDownload,
  FiX,
  FiPlus,
  FiUsers,
  FiList,
  FiFileText,
  FiInfo,
  FiCalendar,
  FiUser,
  FiEdit,
  FiPaperclip,
} from 'react-icons/fi';
import { Briefcase, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ViewTeamByProjectId from '@/components/modules/team/viewTeamByProjectId';
import CreateTeamForm from '@/components/modules/team/createTeam';
import AllTaskList from '@/components/modules/task/AllTaskListById';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function ViewProjectById({ projectId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { project, status, error, successMessage } = useSelector((state) => state.project); // Corrected selector
  const [activeTab, setActiveTab] = useState('details');
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasFetchedAfterStatusChange, setHasFetchedAfterStatusChange] = useState(false); // Flag to prevent loop

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (successMessage && !hasFetchedAfterStatusChange) {
      setStatusUpdateMessage(successMessage);
      setHasFetchedAfterStatusChange(true); // Prevent re-fetching
      dispatch(fetchProjectById(projectId));
      setNewStatus('');
      setTimeout(() => {
        setStatusUpdateMessage('');
        dispatch(resetSuccessMessage()); // Clear success message
        setHasFetchedAfterStatusChange(false); // Reset flag after clearing
      }, 3000);
    }
    if (error.statusChange) {
      setStatusUpdateMessage(error.statusChange);
      setTimeout(() => setStatusUpdateMessage(''), 3000);
    }
  }, [successMessage, error.statusChange, dispatch, projectId, hasFetchedAfterStatusChange]);

  const handleDownload = (url, filename) => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  const handleStatusSubmit = () => {
    if (newStatus) {
      setIsStatusModalOpen(false);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmStatusChange = () => {
    if (newStatus && projectId) {
      dispatch(changeProjectStatus({ projectId, status: newStatus }));
      setIsConfirmModalOpen(false);
      toast.success( 'Status Updated!',
        
    );
    }
  };

  const statusOptions = ['In Progress', 'Completed', 'Cancelled', 'Planned'];

  if (status.fetchProject === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-3 border-t-3 border-teal-600 mx-auto mb-6"></div>
          <p className="text-green-700 font-medium text-lg">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (status.fetchProject === 'failed') {
    return (
      <div className="container mx-auto">
        <Card className="border border-red-200 shadow-lg mx-auto max-w-2xl">
          <CardContent className="p-6">
            <p className="font-semibold text-lg text-red-700 mb-2">
              Unable to load project
            </p>
            <p className="text-red-600 text-sm mb-4">
              {error.fetchProject || 'An error occurred while loading the project.'}
            </p>
            <Button
              onClick={() => dispatch(fetchProjectById(projectId))}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project || !project.data) return null;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-green-500 text-green-700 hover:bg-green-600 hover:text-white font-semibold"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
              Back
            </Button>
            <CardTitle className="text-2xl font-bold text-green-700">
              {project.data.projectName || 'Unnamed Project'}
            </CardTitle>
          </div>
          {statusUpdateMessage && (
            <p
              className={`text-sm mt-2 ${
                successMessage ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {statusUpdateMessage}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Update Project Status
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Status
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="border-gray-200 focus:ring-teal-500 focus:border-teal-500 bg-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions
                  .filter((status) => status !== project.data.status)
                  .map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
              aria-label="Cancel status update"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              disabled={!newStatus}
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Confirm Status Change
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to change the project status to{' '}
            <span className="font-semibold text-teal-600">{newStatus}</span>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-gray-600 border-gray-300 hover:bg-gray-100"
              aria-label="Cancel status change confirmation"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="p-1 rounded-full flex flex-wrap justify-center sm:justify-start gap-2">
          {[
            { id: 'details', label: 'Details', icon: <FiInfo className="h-5 w-5" /> },
            { id: 'tasks', label: 'Tasks', icon: <FiList className="h-5 w-5" /> },
            { id: 'team', label: 'Team', icon: <FiUsers className="h-5 w-5" /> },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`flex items-center gap-2 rounded-full py-2 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={`View ${tab.label} tab`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content Section */}
        <TabsContent value="details" className="mt-6">
          <div className="">
            {/* Project Details and Timeline */}
            <Card className="border border-gray-200 shadow-lg bg-white ">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiInfo className="h-5 w-5 text-teal-600" />
                    Project Details
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/project/edit/${projectId}`)}
                    className="bg-green-600 text-white hover:bg-green-700"
                    aria-label="Edit project"
                  >
                    <FiEdit className="h-5 w-5 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Project ID:</span>
                  <span>{project.data.projectId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPaperclip className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Category:</span>
                  <span>{project.data.category || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiUser className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Client ID:</span>
                  <span>{project.data.clientId || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Status:</span>
                  <Badge
                    onClick={() => setIsStatusModalOpen(true)}
                    className={`cursor-pointer px-3 py-1 text-sm font-medium ${
                      project.data.status === 'Completed'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : project.data.status === 'In Progress'
                        ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                        : project.data.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    aria-label={`Change status from ${project.data.status}`}
                  >
                    {project.data.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <FiUser className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Team Lead:</span>
                  <span>{project.data.teamLeadName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                  <span className="font-bold text-gray-700 w-28">Created At:</span>
                  <span>
                    {project.data.createdAt
                      ? new Date(project.data.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
              {(project.data.startDate || project.data.endDate || project.data.attachments?.length > 0) && (
                <CardContent className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCalendar className="h-5 w-5 text-indigo-600" />
                    Timeline & Attachments
                  </h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    {project.data.startDate && (
                      <div className="flex items-center gap-3">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                        <span className="font-bold text-gray-700 w-28">Start Date:</span>
                        <span>{new Date(project.data.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {project.data.endDate && (
                      <div className="flex items-center gap-3">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                        <span className="font-bold text-gray-700 w-28">End Date:</span>
                        <span>{new Date(project.data.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {project.data.attachments?.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-700">Attachments:</h4>
                        {project.data.attachments.map((attachment, index) => (
                          <Button
                            key={index}
                            onClick={() => handleDownload(attachment.url, attachment.filename)}
                            disabled={isDownloading}
                            variant="outline"
                            className="flex items-center gap-2 w-full justify-start text-left bg-white border-gray-200 hover:bg-gray-50"
                            aria-label={`Download ${attachment.filename}`}
                          >
                            <FiDownload className="h-5 w-5 text-indigo-600" />
                            <span className="text-gray-700 truncate">{attachment.filename}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
              <CardContent className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <FiFileText className="h-5 w-5 text-teal-600" />
                  Description
                </h3>
                {project.data.description ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {project.data.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No description available</p>
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiList className="h-5 w-5 text-teal-600" />
                All Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <AllTaskList projectId={project.data.projectId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card className="border border-gray-200 shadow-lg bg-white">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiUsers className="h-5 w-5 text-teal-600" />
                  Team
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowTeamForm(true)}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  aria-label="Create new team"
                >
                  <FiPlus className="h-5 w-5 mr-2" />
                  Create Team
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {showTeamForm ? (
                project && project.data && (
                  <CreateTeamForm
                    projectDetails={{
                      id: project.data.projectId,
                      name: project.data.projectName,
                      teamLead: {
                        id: project.data.teamLeadId,
                        name: project.data.teamLeadName,
                      },
                      teamMembers: [],
                    }}
                    onSuccess={() => setShowTeamForm(false)}
                  />
                )
              ) : (
                <ViewTeamByProjectId projectId={projectId} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}