// import React from 'react';

// const ProjectwiseAllMeetingAndMom = () => {
//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-2">Projectwise All Meetings & MOM</h2>
//       <p className="text-gray-600">This component will display all meetings and MOM (Minutes of Meeting) related to each project.</p>
//       {/* You can add future UI here */}
//     </div>
//   );
// };

// export default ProjectwiseAllMeetingAndMom;





import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectMeetingMom,
  fetchAllProjectMoms,
  fetchMeetingMomById,
  updateProjectMeetingMom,
  deleteProjectMeetingMom,
  fetchMeetingMomView,
  setSearchQuery,
  setSort,
  setFilters,
  resetSelectedMom,
  resetMeetingMomView,
} from '@/features/projectmeetingmomSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ProjectwiseAllMeetingAndMom = () => {
  const dispatch = useDispatch();
  const {
    moms,
    momsLoading,
    momsError,
    selectedMom,
    selectedMomLoading,
    selectedMomError,
    deleteSuccess,
    meetingMomView,
    meetingMomViewLoading,
    meetingMomViewError,
    searchQuery,
    sortField,
    sortOrder,
    filters,
  } = useSelector((state) => state.projectMeetingMom);

  const [formData, setFormData] = useState({
    title: '',
    meetingMode: 'offline',
    meetingId: '',
    projectId: '',
    content: '',
    file: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openCreateUpdateModal, setOpenCreateUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [momToDelete, setMomToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchAllProjectMoms({ search: searchQuery, sort: sortField, order: sortOrder, filter: filters }))
      .unwrap()
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.status === 404 ? 'No meeting MoMs found for the given criteria.' : error.message || 'Failed to fetch MoMs.',
          className: 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-200',
        });
      });
  }, [dispatch, searchQuery, sortField, sortOrder, filters]);

  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: 'Success',
        description: 'MoM deleted successfully!',
        className: 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-200',
      });
    }
  }, [deleteSuccess]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.projectId.trim()) errors.projectId = 'Project ID is required';
    if (formData.meetingMode === 'online' && !formData.meetingId.trim()) errors.meetingId = 'Meeting ID is required for online meetings';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'meetingId' || (formData.meetingMode === 'online' && formData.meetingId)) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (isEditing) {
        await dispatch(updateProjectMeetingMom({ momId: selectedMom.id, updatedData: data })).unwrap();
        toast({
          title: 'Success',
          description: 'MoM updated successfully!',
          className: 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-200',
        });
      } else {
        await dispatch(createProjectMeetingMom(data)).unwrap();
        toast({
          title: 'Success',
          description: 'MoM created successfully!',
          className: 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-200',
        });
      }
      setOpenCreateUpdateModal(false);
      resetForm();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save MoM.',
        className: 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-200',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      meetingMode: 'offline',
      meetingId: '',
      projectId: '',
      content: '',
      file: null,
    });
    setFormErrors({});
    setIsEditing(false);
    dispatch(resetSelectedMom());
  };

  const handleEdit = (mom) => {
    setFormData({
      title: mom.title,
      meetingMode: mom.meetingMode || 'offline',
      meetingId: mom.meetingId || '',
      projectId: mom.projectId || '',
      content: mom.content || '',
      file: null,
    });
    setIsEditing(true);
    setOpenCreateUpdateModal(true);
    dispatch(fetchMeetingMomById(mom.id)).catch((error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.status === 404 ? 'The selected MoM was not found.' : error.message || 'Failed to fetch MoM details.',
        className: 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-200',
      });
    });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProjectMeetingMom(momToDelete)).unwrap();
      setOpenDeleteModal(false);
      setMomToDelete(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.status === 404 ? 'The MoM to delete was not found.' : error.message || 'Failed to delete MoM.',
        className: 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-200',
      });
    }
  };

  const handleViewPdf = async (momId) => {
    try {
      await dispatch(fetchMeetingMomView(momId)).unwrap();
      setOpenViewModal(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.status === 404 ? 'The MoM PDF was not found.' : error.message || 'Failed to load PDF.',
        className: 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-200',
      });
    }
  };

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSort({ field, order: newOrder }));
  };

  const handleFilter = (value, name) => {
    dispatch(setFilters({ ...filters, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Project Meetings & MoM</h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">Manage your project meeting minutes efficiently</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Input
              placeholder="Search MoMs..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3 pl-10"
              aria-label="Search meeting minutes"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Select name="projectId" onValueChange={(value) => handleFilter(value, 'projectId')}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="project1">Project 1</SelectItem>
              <SelectItem value="project2">Project 2</SelectItem>
            </SelectContent>
          </Select>
          <Select name="meetingMode" onValueChange={(value) => handleFilter(value, 'meetingMode')}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-4 mb-10">
          <Button
            variant="outline"
            onClick={() => handleSort('createdAt')}
            className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors py-3 px-6"
            aria-label="Sort by date"
          >
            Sort by Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSort('title')}
            className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors py-3 px-6"
            aria-label="Sort by title"
          >
            Sort by Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
        </div>

        {/* Create MoM Button */}
        <Button
          onClick={() => {
            resetForm();
            setOpenCreateUpdateModal(true);
          }}
          className="mb-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-6"
          aria-label="Create new meeting minute"
        >
          Create New MoM
        </Button>

        {/* Create/Update Modal */}
        <Dialog open={openCreateUpdateModal} onOpenChange={setOpenCreateUpdateModal}>
          <DialogContent className="rounded-xl bg-white dark:bg-gray-800 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit MoM' : 'Create MoM'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="MoM Title"
                  required
                  className={`rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3 ${formErrors.title ? 'border-red-500' : ''}`}
                  aria-invalid={!!formErrors.title}
                  aria-describedby="title-error"
                />
                {formErrors.title && (
                  <p id="title-error" className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>
              <Select
                name="meetingMode"
                value={formData.meetingMode}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, meetingMode: value }))}
              >
                <SelectTrigger className="rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
              {formData.meetingMode === 'online' && (
                <div>
                  <Input
                    name="meetingId"
                    value={formData.meetingId}
                    onChange={handleInputChange}
                    placeholder="Meeting ID (required for online)"
                    required
                    className={`rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3 ${formErrors.meetingId ? 'border-red-500' : ''}`}
                    aria-invalid={!!formErrors.meetingId}
                    aria-describedby="meetingId-error"
                  />
                  {formErrors.meetingId && (
                    <p id="meetingId-error" className="text-red-500 text-sm mt-1">{formErrors.meetingId}</p>
                  )}
                </div>
              )}
              <div>
                <Input
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  placeholder="Project ID"
                  required
                  className={`rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3 ${formErrors.projectId ? 'border-red-500' : ''}`}
                  aria-invalid={!!formErrors.projectId}
                  aria-describedby="projectId-error"
                />
                {formErrors.projectId && (
                  <p id="projectId-error" className="text-red-500 text-sm mt-1">{formErrors.projectId}</p>
                )}
              </div>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="MoM Content"
                rows={4}
                className="rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white py-3"
                aria-label="Meeting minutes content"
              />
              <Input
                type="file"
                onChange={handleFileChange}
                className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white py-3"
                aria-label="Upload file"
              />
              <DialogFooter className="flex justify-end gap-3">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-6"
                  disabled={momsLoading || selectedMomLoading}
                >
                  {momsLoading || selectedMomLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    isEditing ? 'Update' : 'Create'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setOpenCreateUpdateModal(false);
                  }}
                  className="rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 px-6"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MoM List */}
        {momsLoading && (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
        {momsError && (
          <Alert variant="destructive" className="rounded-xl mb-6">
            <AlertDescription>{momsError}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {moms.length === 0 && !momsLoading && (
            <Alert className="rounded-xl">
              <AlertDescription>No MoMs found.</AlertDescription>
            </Alert>
          )}
          {moms.map((mom) => (
            <Card
              key={mom.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{mom.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Project ID: {mom.projectId}</p>
                <p className="text-gray-600 dark:text-gray-400">Mode: {mom.meetingMode || 'Offline'}</p>
                {mom.meetingId && <p className="text-gray-600 dark:text-gray-400">Meeting ID: {mom.meetingId}</p>}
                <p className="text-gray-700 dark:text-gray-300">{mom.content}</p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(mom)}
                    className="rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-700"
                    aria-label={`Edit ${mom.title}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setMomToDelete(mom.id);
                      setOpenDeleteModal(true);
                    }}
                    className="rounded-xl bg-red-600 hover:bg-red-700"
                    aria-label={`Delete ${mom.title}`}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleViewPdf(mom.id)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                    aria-label={`View PDF for ${mom.title}`}
                  >
                    View PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
          <DialogContent className="rounded-xl bg-white dark:bg-gray-800 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete this MoM? This action cannot be undone.</p>
            <DialogFooter className="flex justify-end gap-3">
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="rounded-xl bg-red-600 hover:bg-red-700"
                disabled={momsLoading}
              >
                {momsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Delete'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpenDeleteModal(false);
                  setMomToDelete(null);
                }}
                className="rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PDF View Modal */}
        <Dialog open={openViewModal} onOpenChange={setOpenViewModal}>
          <DialogContent className="max-w-4xl rounded-xl bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                MoM PDF
              </DialogTitle>
            </DialogHeader>
            {meetingMomViewLoading && (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            )}
            {meetingMomViewError && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{meetingMomViewError}</AlertDescription>
              </Alert>
            )}
            {meetingMomView && (
              <iframe
                src={meetingMomView.pdfUrl}
                width="100%"
                height="600px"
                title="MoM PDF"
                className="border border-gray-300 dark:border-gray-700 rounded-xl"
              />
            )}
            <DialogFooter className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenViewModal(false);
                  dispatch(resetMeetingMomView());
                }}
                className="rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 px-6"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectwiseAllMeetingAndMom;
