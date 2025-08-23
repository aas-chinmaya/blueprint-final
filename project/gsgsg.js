
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectMeetingMom,
  fetchAllProjectMoms,
  updateProjectMeetingMom,
  deleteProjectMeetingMom,
  fetchMeetingMomView,
  fetchMeetingMomById,
  resetSelectedMom,
  resetMeetingMomView,
} from '@/features/projectmeetingmomSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { isValid, parseISO, format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Video,
  AlertTriangle,
  Loader2,
  Eye,
  Edit,
  Trash2,
  FileText,
  Users,
  Download,
  ExternalLink,
  X,
  List,
  Clock,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { subYears, differenceInMinutes, set } from 'date-fns';
import { cn } from '@/lib/utils';

const ProjectwiseAllmeetingMom = ({ project, projectId }) => {
  const dispatch = useDispatch();
  const projectName = project?.projectName;
  const { userData, employeeData, loading } = useSelector((state) => state.user);
  const currentUser = userData?.fullName;

  const { moms, momsLoading, momsError, selectedMom, selectedMomLoading, selectedMomError, deleteSuccess, meetingMomView, meetingMomViewLoading, meetingMomViewError } = useSelector(
    (state) => state.projectMeetingMom
  );

  const [formData, setFormData] = useState({
    projectName: projectName || '',
    projectId: projectId || '',
    agenda: '',
    meetingMode: 'offline',
    meetingId: '',
    title: '',
    meetingDate: null,
    startTime: '',
    endTime: '',
    duration: '',
    attendees: '',
    summary: '',
    notes: '',
    createdBy: currentUser,
    status: 'draft',
    signature: null, // File object for new signature
    signatureUrl: '', // URL for existing signature when editing
  });
  const [formErrors, setFormErrors] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMom, setEditingMom] = useState(null);
  const [momToDelete, setMomToDelete] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ projectId, meetingMode: 'all', status: 'all' });
  const itemsPerPage = 10;

  // Fetch meeting minutes
  useEffect(() => {
    dispatch(fetchAllProjectMoms(projectId));
  }, [dispatch, projectId]);

  // Fetch MoM details when editing
  useEffect(() => {
    if (editingMom) {
      dispatch(fetchMeetingMomById(editingMom.momId));
    }
  }, [dispatch, editingMom]);

  // Set form data when editing or creating
  useEffect(() => {
    if (editingMom && selectedMom) {
      setFormData({
        projectName: projectName || selectedMom.projectName || '',
        projectId: projectId || selectedMom.projectId || '',
        agenda: selectedMom.agenda || '',
        meetingMode: selectedMom.meetingMode || 'offline',
        meetingId: selectedMom.meetingId || '',
        title: selectedMom.title || '',
        meetingDate: selectedMom.meetingDate && isValid(parseISO(selectedMom.meetingDate)) ? parseISO(selectedMom.meetingDate) : null,
        startTime: selectedMom.meetingDate && isValid(parseISO(selectedMom.meetingDate)) ? format(parseISO(selectedMom.meetingDate), 'HH:mm') : '',
        endTime: selectedMom.endTime && isValid(parseISO(selectedMom.endTime)) ? format(parseISO(selectedMom.endTime), 'HH:mm') : '',
        duration: selectedMom.duration || '',
        attendees: selectedMom.participants?.join(', ') || '',
        summary: selectedMom.summary || '',
        notes: selectedMom.notes || '',
        createdBy: currentUser,
        status: selectedMom.status || 'draft',
        signature: null,
        signatureUrl: selectedMom.signature || '',
      });
    } else {
      setFormData({
        projectName: projectName || '',
        projectId: projectId || '',
        agenda: '',
        meetingMode: 'offline',
        meetingId: '',
        title: '',
        meetingDate: null,
        startTime: '',
        endTime: '',
        duration: '',
        attendees: '',
        summary: '',
        notes: '',
        createdBy: currentUser,
        status: 'draft',
        signature: null,
        signatureUrl: '',
      });
    }
    setFormErrors({});
  }, [editingMom, selectedMom, projectName, projectId, currentUser]);

  // Handle side effects for errors and success
  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Meeting minute deleted successfully!');
    }
    if (momsError) {
      toast.error(momsError);
    }
    if (selectedMomError) {
      toast.error(selectedMomError);
    }
    if (meetingMomViewError) {
      toast.error(meetingMomViewError);
    }
  }, [deleteSuccess, momsError, selectedMomError, meetingMomViewError]);

  // Client-side filtering and searching
  const filteredAndSortedMoms = useMemo(() => {
    let result = [...moms];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (mom) =>
          mom.title?.toLowerCase().includes(lowerQuery) ||
          mom.agenda?.toLowerCase().includes(lowerQuery) ||
          mom.summary?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filters
    if (filters.meetingMode && filters.meetingMode !== 'all') {
      result = result.filter((mom) => mom.meetingMode === filters.meetingMode);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((mom) => mom.status === filters.status);
    }
    if (dateRange.from && dateRange.to) {
      result = result.filter((mom) => {
        const meetingDate = new Date(mom.meetingDate);
        return meetingDate >= dateRange.from && meetingDate <= dateRange.to;
      });
    }

    return result;
  }, [moms, searchQuery, filters, dateRange]);

  const calculateDuration = (startTime, endTime, meetingDate) => {
    if (startTime && endTime && meetingDate) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const startDate = set(meetingDate, { hours: startHours, minutes: startMinutes });
      const endDate = set(meetingDate, { hours: endHours, minutes: endMinutes });
      const diffMinutes = differenceInMinutes(endDate, startDate);
      if (diffMinutes <= 0) return '';
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    return '';
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.agenda.trim()) errors.agenda = 'Agenda is required';
    if (!formData.meetingDate) errors.meetingDate = 'Meeting date is required';
    if (!formData.startTime) errors.startTime = 'Start time is required';
    if (!formData.endTime) errors.endTime = 'End time is required';
    if (formData.startTime && formData.endTime && formData.meetingDate) {
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
      const startDate = set(formData.meetingDate, { hours: startHours, minutes: startMinutes });
      const endDate = set(formData.meetingDate, { hours: endHours, minutes: endMinutes });
      if (differenceInMinutes(endDate, startDate) <= 0) {
        errors.endTime = 'End time must be after start time';
      }
    }
    if (!formData.duration.trim()) errors.duration = 'Duration is required';
    if (!formData.summary.trim()) errors.summary = 'Summary is required';
    if (!formData.notes.trim()) errors.notes = 'Notes are required';
    if (formData.meetingMode === 'online' && !formData.meetingId.trim()) errors.meetingId = 'Meeting ID/Link is required for online meetings';
    if (!editingMom && !formData.signature) errors.signature = 'Signature file is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'startTime' || name === 'endTime') {
        newFormData.duration = calculateDuration(newFormData.startTime, newFormData.endTime, newFormData.meetingDate);
      }
      return newFormData;
    });
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.includes('image') || file.type === 'application/pdf')) {
      setFormData((prev) => ({
        ...prev,
        signature: file,
        signatureUrl: URL.createObjectURL(file), // Preview the new file
      }));
      setFormErrors((prev) => ({ ...prev, signature: '' }));
    } else {
      toast.error('Please upload an image or PDF file');
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'meetingMode' && value === 'offline' ? { meetingId: '' } : {}),
    }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => {
      const newFormData = { ...prev, meetingDate: date };
      newFormData.duration = calculateDuration(newFormData.startTime, newFormData.endTime, date);
      return newFormData;
    });
    setFormErrors((prev) => ({ ...prev, meetingDate: '' }));
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    const allowedFields = [
      'projectName',
      'projectId',
      'agenda',
      'meetingMode',
      'meetingId',
      'title',
      'meetingDate',
      'duration',
      'attendees',
      'summary',
      'notes',
      'createdBy',
      'status',
      'signature',
    ];
    const meetingDate = formData.meetingDate && formData.startTime
      ? set(formData.meetingDate, {
          hours: parseInt(formData.startTime.split(':')[0]),
          minutes: parseInt(formData.startTime.split(':')[1]),
        }).toISOString()
      : '';
    Object.entries({
      ...formData,
      meetingDate,
      status,
      attendees: formData.attendees, // Send as string
    }).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        if (key === 'meetingId' && formData.meetingMode === 'offline') return;
        if (key === 'signature' && value instanceof File) {
          data.append(key, value);
        } else if (value !== null && value !== undefined && value !== '') {
          data.append(key, value);
        }
      }
    });

    try {
      editingMom
        ? await dispatch(updateProjectMeetingMom({ momId: editingMom.momId, updatedData: data })).unwrap()
        : await dispatch(createProjectMeetingMom(data)).unwrap();
      toast.success(`Meeting minute ${editingMom ? 'updated' : 'created'} successfully!`);
      handleFormClose();
    } catch (error) {
      toast.error(error || 'Failed to save meeting minute');
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = ({ from, to }) => {
    setDateRange({ from, to });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setDateRange({ from: null, to: null });
    setSearchQuery('');
    setFilters({ projectId, meetingMode: 'all', status: 'all' });
    setCurrentPage(1);
  };

  const handleEdit = (mom) => {
    setEditingMom(mom);
    setShowCreateForm(true);
  };

  const handleDelete = (momId) => setMomToDelete(momId);

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProjectMeetingMom(momToDelete)).unwrap();
      setMomToDelete(null);
    } catch (error) {
      toast.error(error || 'Failed to delete meeting minute.');
    }
  };

  const handleViewPdf = async (momId) => {
    try {
      await dispatch(fetchMeetingMomView(momId)).unwrap();
      setViewingPdf(true);
    } catch (error) {
      toast.error('PDF not found.');
    }
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingMom(null);
    setFormErrors({});
    dispatch(resetSelectedMom());
  };

  const handleDownloadPdf = () => {
    if (meetingMomView?.pdfUrl) {
      const link = document.createElement('a');
      link.href = meetingMomView.pdfUrl;
      link.download = `meeting-minute-${meetingMomView.title || 'mom'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenPdfInNewTab = () => meetingMomView?.pdfUrl && window.open(meetingMomView.pdfUrl, '_blank');

  const getModeVariant = (mode) => (mode === 'online' ? 'default' : 'secondary');
  const getModeIcon = (mode) => (mode === 'online' ? <Video className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />);

  const totalPages = Math.ceil(filteredAndSortedMoms.length / itemsPerPage);
  const paginatedMoms = filteredAndSortedMoms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination button range
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, agenda, or summary..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-10 bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
          />
        </div>
        <Select
          value={filters.meetingMode || 'all'}
          onValueChange={(value) => handleFilterChange('meetingMode', value)}
        >
          <SelectTrigger className="h-10 w-full sm:w-40 bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 shadow-sm">
            <SelectValue placeholder="Meeting Mode" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md rounded-md">
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="h-10 w-full sm:w-40 bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 shadow-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md rounded-md">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="final">Final</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full sm:w-60 justify-start text-left font-normal bg-gray-50 border-indigo-200 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              {dateRange.from ? (
                dateRange.to ? (
                  `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                ) : (
                  format(dateRange.from, 'MMM dd, yyyy')
                )
              ) : (
                <span className="text-gray-400">Select Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white shadow-md rounded-md">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              initialFocus
              disabled={{ before: subYears(new Date(), 5), after: new Date() }}
              className="bg-white rounded-md"
            />
          </PopoverContent>
        </Popover>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="h-10 w-full sm:w-auto bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> New Meeting Minute
        </Button>
        {(searchQuery || filters.meetingMode !== 'all' || filters.status !== 'all' || dateRange.from) && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="h-10 w-full sm:w-auto bg-gray-50 border-indigo-200 text-gray-600 rounded-md hover:bg-gray-100 flex items-center gap-2 transition-colors shadow-sm"
          >
            <X className="h-4 w-4 text-red-500" /> Clear Filters
          </Button>
        )}
      </div>

      <Card className="border-none shadow-sm bg-white rounded-md">
        <CardContent className="p-0">
          {momsLoading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 sm:p-6">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-100 rounded" />
                  <Skeleton className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedMoms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <FileText className="h-12 w-12 mb-4 text-indigo-500" />
              <h3 className="text-lg font-medium">No meeting minutes found</h3>
              <p className="text-sm">Create your first meeting minute to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {paginatedMoms.map((mom) => (
                <li
                  key={mom.momId}
                  className="p-5 sm:p-6 bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{mom.title}</h3>
                        <Badge variant={getModeVariant(mom.meetingMode)} className="text-xs">
                          {getModeIcon(mom.meetingMode)} {mom.meetingMode || 'Offline'}
                        </Badge>
                        <Badge variant={mom.status === 'final' ? 'default' : 'secondary'} className="text-xs">
                          {mom.status || 'Draft'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {mom.meetingDate && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-indigo-500" />
                            <span>
                              {isValid(new Date(mom.meetingDate))
                                ? format(new Date(mom.meetingDate), 'MMM dd, yyyy | HH:mm')
                                : 'No date'}
                            </span>
                          </div>
                        )}
                        {mom.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{mom.duration}</span>
                          </div>
                        )}
                        {mom.participants?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-green-500" />
                            <span>{mom.participants.join(', ')}</span>
                          </div>
                        )}
                        {mom.createdBy && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{mom.createdBy}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{mom.summary || 'No summary available'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewPdf(mom.momId)}
                        className="hover:bg-indigo-50 hover:text-indigo-600 rounded-full"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(mom)}
                        className="hover:bg-green-50 hover:text-green-600 rounded-full"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(mom.momId)}
                        className="hover:bg-red-50 hover:text-red-600 rounded-full"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-indigo-200 text-gray-600 hover:bg-indigo-100 rounded-md transition-colors shadow-sm"
          >
            Previous
          </Button>
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={cn(
                'border-indigo-200 text-gray-600 rounded-md transition-colors shadow-sm',
                currentPage === page ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'hover:bg-indigo-100'
              )}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border-indigo-200 text-gray-600 hover:bg-indigo-100 rounded-md transition-colors shadow-sm"
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={showCreateForm} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-md p-4 sm:p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              {editingMom ? 'Edit Meeting Minute' : 'Create New Meeting Minute'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText className="h-4 w-4 text-indigo-500" /> Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter meeting title..."
                className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm', formErrors.title && 'border-red-500')}
              />
              {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agenda" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <List className="h-4 w-4 text-indigo-500" /> Agenda *
              </Label>
              <Textarea
                id="agenda"
                name="agenda"
                value={formData.agenda}
                onChange={handleInputChange}
                placeholder="Enter meeting agenda..."
                className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition-colors shadow-sm', formErrors.agenda && 'border-red-500')}
              />
              {formErrors.agenda && <p className="text-red-500 text-xs">{formErrors.agenda}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <CalendarIcon className="h-4 w-4 text-indigo-500" /> Meeting Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm',
                      formErrors.meetingDate && 'border-red-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {formData.meetingDate ? format(formData.meetingDate, 'PPP') : <span className="text-gray-400">Select Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-md rounded-md">
                  <Calendar
                    mode="single"
                    selected={formData.meetingDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={{ before: subYears(new Date(), 5), after: new Date() }}
                    className="bg-white rounded-md"
                  />
                </PopoverContent>
              </Popover>
              {formErrors.meetingDate && <p className="text-red-500 text-xs">{formErrors.meetingDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4 text-indigo-500" /> Start Time *
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm', formErrors.startTime && 'border-red-500')}
              />
              {formErrors.startTime && <p className="text-red-500 text-xs">{formErrors.startTime}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4 text-indigo-500" /> End Time *
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm', formErrors.endTime && 'border-red-500')}
              />
              {formErrors.endTime && <p className="text-red-500 text-xs">{formErrors.endTime}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4 text-indigo-500" /> Duration
              </Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                readOnly
                className="bg-gray-100 border-indigo-200 rounded-md shadow-sm"
              />
              {formErrors.duration && <p className="text-red-500 text-xs">{formErrors.duration}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Video className="h-4 w-4 text-indigo-500" /> Meeting Mode
              </Label>
              <Select value={formData.meetingMode} onValueChange={(value) => handleSelectChange('meetingMode', value)}>
                <SelectTrigger className="bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md rounded-md">
                  <SelectItem value="offline">Offline Meeting</SelectItem>
                  <SelectItem value="online">Online Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.meetingMode === 'online' && (
              <div className="space-y-2">
                <Label htmlFor="meetingId" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Video className="h-4 w-4 text-indigo-500" /> Meeting ID/Link *
                </Label>
                <Input
                  id="meetingId"
                  name="meetingId"
                  value={formData.meetingId}
                  onChange={handleInputChange}
                  placeholder="Enter meeting ID or link..."
                  className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm', formErrors.meetingId && 'border-red-500')}
                />
                {formErrors.meetingId && <p className="text-red-500 text-xs">{formErrors.meetingId}</p>}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="attendees" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Users className="h-4 w-4 text-indigo-500" /> Attendees
              </Label>
              <Input
                id="attendees"
                name="attendees"
                value={formData.attendees}
                onChange={handleInputChange}
                placeholder="Enter attendees (comma separated)..."
                className="bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <ImageIcon className="h-4 w-4 text-indigo-500" /> Signature File *
              </Label>
              <Input
                id="signature"
                name="signature"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm', formErrors.signature && 'border-red-500')}
              />
              {formData.signatureUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Signature:</p>
                  {formData.signatureUrl.endsWith('.pdf') ? (
                    <a href={formData.signatureUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      View PDF
                    </a>
                  ) : (
                    <img src={formData.signatureUrl} alt="Signature" className="h-20 w-auto border rounded-md" />
                  )}
                </div>
              )}
              {formErrors.signature && <p className="text-red-500 text-xs">{formErrors.signature}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="summary" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText className="h-4 w-4 text-indigo-500" /> Summary *
              </Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Enter meeting summary..."
                className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition-colors shadow-sm', formErrors.summary && 'border-red-500')}
              />
              {formErrors.summary && <p className="text-red-500 text-xs">{formErrors.summary}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText className="h-4 w-4 text-indigo-500" /> Notes *
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter additional notes..."
                className={cn('bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition-colors shadow-sm', formErrors.notes && 'border-red-500')}
              />
              {formErrors.notes && <p className="text-red-500 text-xs">{formErrors.notes}</p>}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleFormClose}
              className="w-full sm:w-auto bg-gray-50 border-indigo-200 text-gray-600 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
            >
              Cancel
            </Button>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="submit"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={selectedMomLoading}
                className="w-full sm:w-auto bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
              >
                {selectedMomLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save as Draft
              </Button>
              <Button
                type="submit"
                onClick={(e) => handleSubmit(e, 'final')}
                disabled={selectedMomLoading}
                className="w-full sm:w-auto bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
              >
                {selectedMomLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!momToDelete} onOpenChange={() => setMomToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-md p-4 sm:p-6 shadow-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <AlertDialogTitle className="text-lg font-semibold text-gray-800">Confirm Deletion</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-gray-600">
              Are you sure you want to delete this meeting minute? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel
              onClick={() => setMomToDelete(null)}
              disabled={selectedMomLoading}
              className="w-full sm:w-auto bg-gray-50 border-indigo-200 text-gray-600 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={selectedMomLoading}
              className="w-full sm:w-auto bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
            >
              {selectedMomLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewingPdf} onOpenChange={() => { setViewingPdf(false); dispatch(resetMeetingMomView()); }}>
        <DialogContent className="max-w-full sm:max-w-5xl max-h-[90vh] h-[80vh] bg-white rounded-md p-4 sm:p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" /> Meeting Minute PDF
            </DialogTitle>
            <div className="flex gap-3">
              {meetingMomView?.pdfUrl && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2 bg-gray-50 border-indigo-200 text-gray-600 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    <Download className="h-4 w-4 text-indigo-500" /> Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenPdfInNewTab}
                    className="flex items-center gap-2 bg-gray-50 border-indigo-200 text-gray-600 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4 text-green-500" /> Open in New Tab
                  </Button>
                </>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            {meetingMomViewLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm text-gray-600">Loading PDF...</p>
              </div>
            ) : meetingMomView?.pdfUrl ? (
              <iframe
                src={meetingMomView.pdfUrl}
                title="Meeting Minute PDF"
                className="w-full h-full border border-indigo-200 rounded-md shadow-sm"
                style={{ minHeight: '500px' }}
              />
            ) : (
              <p className="text-gray-600 text-sm">No PDF available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectwiseAllmeetingMom;




