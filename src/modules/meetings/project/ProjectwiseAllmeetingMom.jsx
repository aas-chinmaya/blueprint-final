





import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectMeetingMom,
  fetchAllProjectMoms,
  updateProjectMeetingMom,
  fetchMeetingMomById,
  fetchMeetingMomView,
  resetSelectedMom,
  resetMeetingMomView,
} from '@/features/projectmeetingmomSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Video,
  Eye,
  Edit,
  FileText,
  Users,
  Clock,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, isValid, subYears, set } from 'date-fns';
import { cn } from '@/lib/utils';
import MomForm from './MomForm';
import ViewMomModal from './ViewMomModal';

const ProjectwiseAllmeetingMom = ({ project, projectId }) => {
  const dispatch = useDispatch();
  const projectName = project?.projectName;
  const { userData, loading } = useSelector((state) => state.user);
  const currentUser = userData?.fullName;

  const { moms, momsLoading, momsError, selectedMom, selectedMomLoading, selectedMomError, meetingMomView, meetingMomViewLoading, meetingMomViewError } = useSelector(
    (state) => state.projectMeetingMom
  );

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMom, setEditingMom] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ projectId, meetingMode: 'all', status: 'all' });
  const itemsPerPage = 10;

  // Fetch meeting minutes
  useEffect(() => {
    dispatch(fetchAllProjectMoms(projectId));
  }, [dispatch, projectId]);

  // Handle side effects for errors
  useEffect(() => {
    if (momsError) {
      toast.error(momsError);
    }
    if (selectedMomError) {
      toast.error(selectedMomError);
    }
    if (meetingMomViewError) {
      toast.error(meetingMomViewError);
    }
  }, [momsError, selectedMomError, meetingMomViewError]);

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

  const handleSubmit = async (e, status, formData) => {
    e.preventDefault();
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
      attendees: formData.attendees,
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

  const handleEdit = async (mom) => {
    setEditingMom(mom);
    try {
      await dispatch(fetchMeetingMomById(mom.momId)).unwrap();
      setShowCreateForm(true);
    } catch (error) {
      toast.error('Failed to fetch meeting minute details');
    }
  };

  const handleViewPdf = async (mom) => {
    try {
      await dispatch(fetchMeetingMomView(mom.momId)).unwrap();
      setViewingPdf(mom);
    } catch (error) {
      toast.error('PDF not found.');
    }
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingMom(null);
    dispatch(resetSelectedMom());
  };

  const getModeVariant = (mode) => (mode === 'online' ? 'default' : 'secondary');
  const getModeIcon = (mode) => (mode === 'online' ? <Video className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />);

  const totalPages = Math.ceil(filteredAndSortedMoms.length / itemsPerPage);
  const paginatedMoms = filteredAndSortedMoms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          <Plus className="h-4 w-4" /> Create
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
                      {mom.status === 'final' ? (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewPdf(mom)}
                          className="hover:bg-indigo-50 hover:text-indigo-600 rounded-full"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(mom)}
                          className="hover:bg-green-50 hover:text-green-600 rounded-full"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
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

      <MomForm
        open={showCreateForm}
        onOpenChange={handleFormClose}
        selectedMom={selectedMom}
        selectedMomLoading={selectedMomLoading}
        selectedMomError={selectedMomError}
        editingMom={editingMom}
        currentUser={currentUser}
        projectName={projectName}
        projectId={projectId}
        handleSubmit={handleSubmit}
      />

      <ViewMomModal
        open={!!viewingPdf}
        onOpenChange={() => {
          setViewingPdf(null);
          dispatch(resetMeetingMomView());
        }}
        meetingMomView={meetingMomView}
        meetingMomViewLoading={meetingMomViewLoading}
        status={viewingPdf?.status}
      />
    </div>
  );
};

export default ProjectwiseAllmeetingMom;