import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, FileText } from 'lucide-react';
import DownloadMom from './DownloadMom';

const ViewMomModal = ({ open, onOpenChange, meetingMomView, meetingMomViewLoading, status }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-5xl max-h-[90vh] h-[80vh] bg-white rounded-md p-4 sm:p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" /> Meeting Minute PDF
          </DialogTitle>
          {status === 'final' && (
            <DownloadMom pdfUrl={meetingMomView?.pdfUrl} title={meetingMomView?.title} />
          )}
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
  );
};

export default ViewMomModal;