import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, FileText, List, Calendar as CalendarIcon, Clock, Video, Users, Image as ImageIcon } from 'lucide-react';
import { format, set, subYears, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MomForm = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  editingMom,
  selectedMomLoading,
  currentUser,
  projectName,
  projectId,
  handleSubmit,
}) => {
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
        signatureUrl: URL.createObjectURL(file),
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

  const handleFormSubmit = (e, status) => {
    e.preventDefault();
    if (!validateForm()) return;
    handleSubmit(e, status);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onOpenChange}
            className="w-full sm:w-auto bg-gray-50 border-indigo-200 text-gray-600 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cancel
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              onClick={(e) => handleFormSubmit(e, 'draft')}
              disabled={selectedMomLoading}
              className="w-full sm:w-auto bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
            >
              {selectedMomLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleFormSubmit(e, 'final')}
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
  );
};

export default MomForm;