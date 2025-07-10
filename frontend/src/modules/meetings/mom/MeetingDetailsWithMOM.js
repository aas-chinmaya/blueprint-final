
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { format, isAfter, addHours } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMoMByMeetingId,
  resetMoMByMeetingId,
  createMoM,
  updateMoM,
  fetchMoMView,
} from "@/store/features/pre-project/momSlice";
import { submitCause } from "@/store/features/pre-project/causeSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Download,
  Edit2,
  AlertCircle,
  Calendar,
  Users,
  Clock,
  FileText,
  Signature,
  User,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Image from "next/image";

function MeetingDetailsWithMOM({ isOpen, onClose, meeting, TIME_ZONE }) {
  const dispatch = useDispatch();
  const { momByMeetingId, momByMeetingIdLoading, momView, momViewLoading } = useSelector(
    (state) => state.mom
  );
  const [mode, setMode] = useState("view");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTimeExceeded, setIsTimeExceeded] = useState(false);
  const [isWithinOneHour, setIsWithinOneHour] = useState(false);
  const [reasonForDelay, setReasonForDelay] = useState("");
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const containerRef = useRef(null);
  const { currentUser } = useCurrentUser();

  // Form state for creating/editing MoM
  const [momForm, setMomForm] = useState({
    agenda: meeting?.agenda || "",
    meetingMode: meeting?.meetingMode || "Online",
    duration: "",
    participants: "",
    summary: "",
    notes: "",
    createdBy: currentUser?.name || "",
    meetingId: meeting?.meetingId || "",
  });

  // Helper: Format time (e.g., "10:00 AM")
  const formatTimes = (dateTime) => {
    if (!dateTime) return "";
    try {
      return format(new Date(dateTime), "p");
    } catch {
      return "";
    }
  };

  // Helper: Compute duration as "startTime - endTime"
  const getDurationString = useCallback(() => {
    const start = formatTimes(meeting?.start?.dateTime);
    const end = formatTimes(meeting?.end?.dateTime);
    return start && end ? `${start} - ${end}` : "";
  }, [meeting]);

  // Helper: Parse attendees into an array
  const getAttendeesArray = (attendees) => {
    if (Array.isArray(attendees)) {
      return attendees;
    }
    return attendees ? String(attendees).split(",").map((p) => p.trim()).filter(Boolean) : [];
  };

  // Helper: Check meeting time status
  const checkMeetingTimeStatus = useCallback(() => {
    if (!meeting?.end?.dateTime) return { isTimeExceeded: false, isWithinOneHour: false };
    const endTime = new Date(meeting.end.dateTime);
    const now = new Date();
    const oneHourAfterEnd = addHours(endTime, 1);
    return {
      isTimeExceeded: isAfter(now, endTime),
      isWithinOneHour: isAfter(now, endTime) && !isAfter(now, oneHourAfterEnd),
    };
  }, [meeting]);

  // Effect: Initialize form and check time status
  useEffect(() => {
    const { isTimeExceeded, isWithinOneHour } = checkMeetingTimeStatus();
    setIsTimeExceeded(isTimeExceeded);
    setIsWithinOneHour(isWithinOneHour);

    if (momByMeetingId && momByMeetingId.meetingId === meeting?.meetingId) {
      setMomForm({
        agenda: momByMeetingId.agenda || meeting?.agenda || "",
        meetingMode: momByMeetingId.meetingMode || meeting?.meetingMode || "Online",
        duration: momByMeetingId.duration || getDurationString() || "",
        participants: Array.isArray(momByMeetingId.participants)
          ? momByMeetingId.participants.join(", ")
          : momByMeetingId.participants || getAttendeesArray(meeting?.attendees).join(", ") || "",
        summary: momByMeetingId.summary || "",
        notes: momByMeetingId.notes || "",
        createdBy: momByMeetingId.createdBy || currentUser?.name || "",
        meetingId: meeting?.meetingId || "",
      });
      setMode("view");
      setIsEditMode(false);
    } else {
      setMomForm({
        agenda: meeting?.agenda || "",
        meetingMode: meeting?.meetingMode || "Online",
        duration: getDurationString() || "",
        participants: getAttendeesArray(meeting?.attendees).join(", ") || "",
        summary: "",
        notes: "",
        createdBy: currentUser?.name || "",
        meetingId: meeting?.meetingId || "",
      });
      setMode("form");
      setIsEditMode(false);
    }

    setReasonForDelay(momByMeetingId?.reasonForDelay || "");
    setIsAgreedToTerms(false);
    setSignatureFile(null);
    setSignaturePreview(null);
  }, [momByMeetingId, meeting, checkMeetingTimeStatus, getDurationString, currentUser?.name]);

  // Effect: Fetch MoM data when modal opens
  useEffect(() => {
    if (isOpen && meeting?.meetingId) {
      dispatch(fetchMoMByMeetingId(meeting.meetingId));
    }
  }, [isOpen, meeting?.meetingId, dispatch]);

  // Effect: Fetch MoM view when available
  useEffect(() => {
    if (isOpen && momByMeetingId?.momId && mode === "view") {
      dispatch(fetchMoMView(momByMeetingId.momId));
    }
  }, [isOpen, momByMeetingId?.momId, mode, dispatch]);

  // Effect: Clean up blob URL and reset state
  useEffect(() => {
    return () => {
      if (momView?.pdfUrl) {
        URL.revokeObjectURL(momView.pdfUrl);
      }
      if (signaturePreview) {
        URL.revokeObjectURL(signaturePreview);
      }
      if (!isOpen) {
        dispatch(resetMoMByMeetingId());
      }
    };
  }, [isOpen, momView?.pdfUrl, signaturePreview, dispatch]);

  // Handler: Form input changes
  const handleMomFormChange = (e, field) => {
    setMomForm({ ...momForm, [field]: e.target.value });
  };

  // Handler: Reason for delay change
  const handleReasonForDelayChange = (e) => {
    setReasonForDelay(e.target.value);
  };

  // Handler: Signature file change
  const handleSignatureFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid image file (.png, .jpg, .jpeg).");
      setSignatureFile(null);
      setSignaturePreview(null);
    }
  };

  // Handler: Terms agreement checkbox
  const handleTermsChange = (checked) => {
    setIsAgreedToTerms(checked);
  };

  // Helper: Check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    return (
      momForm.createdBy.trim() &&
      momForm.summary.trim() &&
      signatureFile &&
      (!isTimeExceeded || (reasonForDelay.trim() && isAgreedToTerms))
    );
  };

  // Handler: Form submission
  const handleSubmit = async () => {
    if (!momForm.createdBy.trim()) {
      toast.info("Please enter the name of the person who created the MoM.");
      return;
    }
    if (!momForm.summary.trim()) {
      toast.info("Please enter a summary.");
      return;
    }
    if (!signatureFile) {
      toast.info("Please upload a signature image.");
      return;
    }
    if (isTimeExceeded && !isEditMode && (!reasonForDelay.trim() || !isAgreedToTerms)) {
      toast.info("Please provide a reason for the delay and agree to the terms.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("agenda", momForm.agenda);
      formData.append("meetingMode", momForm.meetingMode);
      formData.append("duration", momForm.duration);
      formData.append("participants", JSON.stringify(momForm.participants.split(",").map((p) => p.trim()).filter(Boolean)));
      formData.append("summary", momForm.summary);
      formData.append("notes", momForm.notes);
      formData.append("createdBy", momForm.createdBy);
      formData.append("meetingId", momForm.meetingId);
      formData.append("submittedBy", currentUser?.name || momForm.createdBy);
      if (signatureFile) {
        formData.append("signature", signatureFile);
      }
      if (isTimeExceeded && !isEditMode) {
        formData.append("reasonForDelay", reasonForDelay);
      }

      if (isTimeExceeded && !isEditMode) {
        await dispatch(
          submitCause({
            meetingId: meeting.meetingId,
            reason: reasonForDelay,
            submittedBy: currentUser?.name || momForm.createdBy,
          })
        ).unwrap();
        toast.success("Cause for delay submitted successfully!");
      }

      if (isEditMode && momByMeetingId) {
        await dispatch(updateMoM(formData)).unwrap();
        toast.success("MoM updated successfully!");
      } else {
        await dispatch(createMoM(formData)).unwrap();
        toast.success("MoM created successfully!");
      }
      setMode("view");
      setIsEditMode(false);
      setReasonForDelay("");
      setIsAgreedToTerms(false);
      setSignatureFile(null);
      setSignaturePreview(null);
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} MoM: ${error?.message || "Unknown error"}`);
    }
  };

  // Handler: Toggle mode
  const handleToggleMode = () => {
    if (mode === "view") {
      setMode("form");
      setIsEditMode(momByMeetingId ? true : false);
    } else {
      setMode("view");
      setIsEditMode(false);
      setReasonForDelay("");
      setIsAgreedToTerms(false);
      setSignatureFile(null);
      setSignaturePreview(null);
    }
  };

  // Handler: Close modal
  const handleClose = () => {
    dispatch(resetMoMByMeetingId());
    onClose();
  };

  // Helper: Render participant with circled initial and email tooltip
  const renderParticipant = (participant, index) => {
    const initial = participant.charAt(0).toUpperCase();
    return (
      <div
        key={index}
        className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-semibold text-sm cursor-pointer group"
        title={participant}
      >
        {initial}
        <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
          {participant}
        </span>
      </div>
    );
  };

  // Loading state
  if (momByMeetingIdLoading || momViewLoading) {
    return (
      <div className="min-h-[400px] bg-white rounded-xl flex items-center justify-center shadow-md">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
          <span className="text-green-600 text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-green-600 flex items-center">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          {mode === "form" ? (isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting") : "Meeting Details"}
        </h2>
        {mode === "view" && momByMeetingId && (
          <button
            onClick={handleToggleMode}
            className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            title="Edit MoM"
          >
            <Edit2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Warning Messages */}
      {isTimeExceeded && (!momByMeetingId || !isWithinOneHour) && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>
            {!momByMeetingId
              ? isWithinOneHour
                ? "Please complete MoM within one hour of meeting end time."
                : "Meeting has ended, and no MoM has been created."
              : "Meeting has ended, and MoM creation is delayed beyond one hour."}
          </span>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* conseguenze */}
        <div className="space-y-4">
          <div>
            <Label className="text-green-600 font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Agenda
            </Label>
            <p className="text-gray-700 text-sm sm:text-base">{meeting?.agenda || "N/A"}</p>
          </div>
          <div>
            <Label className="text-green-600 font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Meeting Mode
            </Label>
            <p className="text-gray-700 text-sm sm:text-base">{meeting?.meetingMode || "Online"}</p>
          </div>
          <div>
            <Label className="text-green-600 font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Duration
            </Label>
            <p className="text-gray-700 text-sm sm:text-base">{getDurationString() || "N/A"}</p>
          </div>
          <div>
            <Label className="text-green-600 font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Participants
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {getAttendeesArray(meeting?.attendees).length > 0 ? (
                getAttendeesArray(meeting?.attendees).map((participant, index) =>
                  renderParticipant(participant, index)
                )
              ) : (
                <p className="text-gray-700 text-sm sm:text-base">N/A</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Form or MoM Preview */}
        <div className="space-y-4">
          {mode === "form" ? (
            // Form View
            <div className="space-y-4">
              
              <div>
                <Label className="text-green-600 font-semibold flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Summary
                </Label>
                <Textarea
                  value={momForm.summary}
                  onChange={(e) => handleMomFormChange(e, "summary")}
                  placeholder="Enter meeting summary..."
                  className="mt-1 border-green-200 focus:ring-1 focus:ring-green-500 bg-green-50/50 rounded-lg text-sm sm:text-base"
                  rows={4}
                />
              </div>
              <div>
                <Label className="text-green-600 font-semibold flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Notes
                </Label>
                <Textarea
                  value={momForm.notes}
                  onChange={(e) => handleMomFormChange(e, "notes")}
                  placeholder="Enter additional notes..."
                  className="mt-1 border-green-200 focus:ring-1 focus:ring-green-500 bg-green-50/50 rounded-lg text-sm sm:text-base"
                  rows={4}
                />
              </div>
              {isTimeExceeded && !isEditMode && (
                <>
                  <div>
                    <Label className="text-green-600 font-semibold flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      Reason for Delay
                    </Label>
                    <Textarea
                      value={reasonForDelay}
                      onChange={handleReasonForDelayChange}
                      placeholder="Enter reason for delay..."
                      className="mt-1 border-green-200 focus:ring-1 focus:ring-green-500 bg-green-50/50 rounded-lg text-sm sm:text-base"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={isAgreedToTerms}
                      onCheckedChange={handleTermsChange}
                      className="border-green-400 data-[state=checked]:bg-green-500"
                    />
                    <Label htmlFor="terms" className="text-green-600 font-semibold text-sm sm:text-base">
                      I agree to the cause terms and conditions
                    </Label>
                  </div>
                </>
              )}
              <div>
                <Label className="text-green-600 font-semibold flex items-center">
                  <Signature className="h-5 w-5 mr-2" />
                  Signature (Image)
                </Label>
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleSignatureFileChange}
                  className="mt-1 border-green-200 focus:ring-1 focus:ring-green-500 bg-green-50/50 rounded-lg text-sm sm:text-base"
                />
                {signaturePreview && (
                  <div className="mt-2">
                    <Image
                      src={signaturePreview}
                      alt="Signature Preview"
                      width={120}
                      height={80}
                      className="rounded-md border border-green-200"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label className="text-green-600 font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Created By
                </Label>
                <Input
                  value={momForm.createdBy}
                  onChange={(e) => handleMomFormChange(e, "createdBy")}
                  placeholder="Recorder's name..."
                  className="mt-1 border-green-200 focus:ring-1 focus:ring-green-500 bg-green-50/50 rounded-lg text-sm sm:text-base"
                />
              </div>
             
              <div className="flex justify-end gap-3">
  {isEditMode && (
    <Button
      variant="outline"
      className="border-green-500 text-green-600 hover:bg-green-100 rounded-lg text-sm sm:text-base"
      onClick={() => setMode("view")}
    >
      Cancel
    </Button>
  )}

  <Button
    className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm sm:text-base"
    onClick={handleSubmit}
    disabled={
      momByMeetingIdLoading ||
      (isTimeExceeded && !isEditMode && !areRequiredFieldsFilled())
    }
  >
    {momByMeetingIdLoading ? (
      <>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Submitting...
      </>
    ) : isEditMode ? (
      "Update MoM"
    ) : (
      "Create MoM"
    )}
  </Button>
</div>

            </div>
          ) : (
            // View Mode: MoM Preview
            <div className="space-y-4">
              {momByMeetingId && momView?.pdfUrl && (
                <div>
                
                  <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg border border-green-200 overflow-hidden">
                    <iframe
                      src={momView.pdfUrl}
                      width="100%"
                      height="100%"
                      className="rounded-lg"
                      title="MoM PDF Preview"
                    />
                  </div>
                  {/* <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-100 rounded-lg text-sm sm:text-base"
                      onClick={() => window.open(momView.pdfUrl, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div> */}
                </div>
              )}
              {/* {momByMeetingId && (
                <>
                  <div>
                    <Label className="text-green-600 font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Summary
                    </Label>
                    <p className="text-gray-700 text-sm sm:text-base">{momByMeetingId.summary || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-green-600 font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Notes
                    </Label>
                    <p className="text-gray-700 text-sm sm:text-base">{momByMeetingId.notes || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-green-600 font-semibold flex items-center">
                      <Signature className="h-5 w-5 mr-2" />
                      Signature
                    </Label>
                    <p className="text-gray-700 text-sm sm:text-base">[File Uploaded]</p>
                  </div>
                  <div>
                    <Label className="text-green-600 font-semibold flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Created By
                    </Label>
                    <p className="text-gray-700 text-sm sm:text-base">{momByMeetingId.createdBy || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-green-600 font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Meeting Date
                    </Label>
                    <p className="text-gray-700 text-sm sm:text-base">{momByMeetingId.date || meeting?.date || "N/A"}</p>
                  </div>
                  {momByMeetingId.reasonForDelay && (
                    <div>
                      <Label className="text-green-600 font-semibold flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                        Reason for Delay
                      </Label>
                      <p className="text-gray-700 text-sm sm:text-base">{momByMeetingId.reasonForDelay}</p>
                    </div>
                  )}
                </>
              )} */}
            </div>
          )}
        </div>
      </div>

 
    </div>
  );
}

export default MeetingDetailsWithMOM;