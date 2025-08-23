
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitProjectShowCause } from '@/features/projectShowCauseSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, Users, FileText, Video, User, ImageIcon, AlertTriangle } from 'lucide-react';
import { format, isValid, parseISO, addMinutes } from 'date-fns';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ProjectMomView = ({ momData }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const currentUser = userData?.fullName;
  const { loading } = useSelector((state) => state.projectShowCause);

  const [showCauseModal, setShowCauseModal] = useState(false);
  const [reason, setReason] = useState('');
console.log('Rendering ProjectMomView with momData:', momData);
  if (!momData) {
    return <p className="text-gray-600 text-sm text-center">No meeting details available</p>;
  }

  // ================== Delay Check (runs every render) ==================
  let delayMinutes = null;
  let isShowCauseRequired = false;

  try {
    if (momData.meetingDate && momData.duration && (momData.createdAt || momData.updatedAt)) {
      const meetingDate = parseISO(momData.meetingDate);
      if (isValid(meetingDate)) {
        const durationMatch = momData.duration.match(/(\d+)?h?\s*(\d+)?m?/);
        const hours = durationMatch?.[1] ? parseInt(durationMatch[1], 10) : 0;
        const minutes = durationMatch?.[2] ? parseInt(durationMatch[2], 10) : 0;
        const totalMinutes = hours * 60 + minutes;

        const meetingEnd = addMinutes(meetingDate, totalMinutes);
        const referenceTime = momData.updatedAt ? parseISO(momData.updatedAt) : parseISO(momData.createdAt);

        if (isValid(referenceTime)) {
          delayMinutes = Math.round((referenceTime - meetingEnd) / (1000 * 60));
          isShowCauseRequired = delayMinutes > 60;

          // ✅ Console logs run every render
          console.log('================ Delay Check ================');
          console.log('Meeting End Time:', meetingEnd);
          console.log('Reference Time (Created/Updated):', referenceTime);
          console.log('Delay in Minutes:', delayMinutes);
          console.log('Show Cause Required:', isShowCauseRequired);
          console.log('============================================');
        }
      }
    }
  } catch (err) {
    console.error('Delay check error:', err);
  }

  // ================== Submit Handler ==================
  const handleSubmitShowCause = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for the delay.');
      return;
    }
    try {
      await dispatch(
        submitProjectShowCause({
          projectId: momData.projectId,
          reason,
          submittedBy: currentUser,
        })
      ).unwrap();
      toast.success('Show cause submitted successfully!');
      setShowCauseModal(false);
      setReason('');
    } catch (err) {
      toast.error(err?.message || 'Failed to submit show cause.');
    }
  };

  const getModeVariant = (mode) => (mode === 'online' ? 'default' : 'secondary');
  const getModeIcon = (mode) => (mode === 'online' ? <Video className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />);

  return (
    <>
      <Card className="border-none shadow-sm bg-white rounded-md">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            {momData.title || 'Meeting Minute'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meeting Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-indigo-500" /> Project
              </div>
              <p className="text-sm text-gray-600">{momData.projectName || 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-indigo-500" /> Agenda
              </div>
              <p className="text-sm text-gray-600">{momData.agenda || 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarIcon className="h-4 w-4 text-indigo-500" /> Meeting Date
              </div>
              <p className="text-sm text-gray-600">
                {momData.meetingDate && isValid(parseISO(momData.meetingDate))
                  ? format(parseISO(momData.meetingDate), 'MMM dd, yyyy | HH:mm')
                  : 'N/A'}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 text-indigo-500" /> Duration
              </div>
              <p className="text-sm text-gray-600">{momData.duration || 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Video className="h-4 w-4 text-indigo-500" /> Meeting Mode
              </div>
              <Badge variant={getModeVariant(momData.meetingMode)} className="text-xs flex items-center gap-1">
                {getModeIcon(momData.meetingMode)} {momData.meetingMode || 'Offline'}
              </Badge>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4 text-indigo-500" /> Attendees
              </div>
              <p className="text-sm text-gray-600">{momData.participants?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4 text-indigo-500" /> Created By
              </div>
              <p className="text-sm text-gray-600">{momData.createdBy || 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ImageIcon className="h-4 w-4 text-indigo-500" /> Signature
              </div>
              {momData.signature ? (
                momData.signature.endsWith('.pdf') ? (
                  <a href={momData.signature} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                    View PDF
                  </a>
                ) : (
                  <img src={momData.signature} alt="Signature" className="h-20 w-auto border rounded-md" />
                )
              ) : (
                <p className="text-sm text-gray-600">No signature available</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-indigo-500" /> Summary
              </div>
              <p className="text-sm text-gray-600">{momData.summary || 'No summary available'}</p>
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-indigo-500" /> Notes
              </div>
              <p className="text-sm text-gray-600">{momData.notes || 'No notes available'}</p>
            </div>
          </div>

          {/* Delay & Show Cause */}
          {isShowCauseRequired && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                <AlertTriangle className="h-4 w-4" />
                Delay detected ({delayMinutes} min) — Cause submission required
              </div>
              <Button onClick={() => setShowCauseModal(true)} className="bg-red-600 text-white hover:bg-red-700">
                Submit Cause
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Show Cause Modal */}
      <Dialog open={showCauseModal} onOpenChange={setShowCauseModal}>
        <DialogContent className="max-w-full sm:max-w-md bg-white rounded-md p-4 sm:p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" /> Submit Show Cause
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText className="h-4 w-4 text-indigo-500" /> Reason for Delay *
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for delay..."
                className="bg-gray-50 border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setShowCauseModal(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmitShowCause} disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white">
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectMomView;
