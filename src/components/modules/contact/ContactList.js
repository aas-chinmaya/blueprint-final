

"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContacts,
  getContactById,
  deleteContact,
  updateContactStatus,
  clearSelectedContact,
} from "@/store/features/contactSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
  MessageSquare,
  Clock,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isWithinInterval, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ContactsList = () => {
  const dispatch = useDispatch();
  const { contacts, selectedContact, status, error } = useSelector((state) => state.contact);

  // State for search, sort, filter, pagination, and status update
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [feedback, setFeedback] = useState("");

  // Fetch contacts on component mount
  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  // Handle view contact
  const handleViewContact = (contactId) => {
    dispatch(getContactById(contactId));
    setIsViewModalOpen(true);
  };

  // Handle delete contact
  const handleDeleteContact = (contactId) => {
    dispatch(deleteContact(contactId));
  };

  // Handle status update
  const handleStatusUpdate = () => {
    if (selectedContactId && newStatus) {
      dispatch(updateContactStatus({ 
        contactId: selectedContactId, 
        status: newStatus,
        feedback: feedback
      }));
      setIsStatusModalOpen(false);
      setNewStatus("");
      setFeedback("");
    }
  };

  // Open status update modal
  const openStatusModal = (contactId) => {
    setSelectedContactId(contactId);
    setIsStatusModalOpen(true);
  };

  // Close view modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    dispatch(clearSelectedContact());
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    // Filter out deleted contacts
    result = result.filter((contact) => !contact.isDeleted);

    // Search
    if (searchTerm) {
      result = result.filter(
        (contact) =>
          (contact.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.contactId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.designation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.industry || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.referralSource || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((contact) => contact.status === filterStatus);
    }

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      result = result.filter((contact) =>
        contact.createdAt
          ? isWithinInterval(parseISO(contact.createdAt), {
              start: dateRange.from,
              end: dateRange.to,
            })
          : false
      );
    }

    // Sort
    result.sort((a, b) => {
      const fieldA = a[sortField] || "";
      const fieldB = b[sortField] || "";
      if (sortField === "createdAt" || sortField === "updatedAt") {
        const dateA = fieldA ? parseISO(fieldA) : new Date(0);
        const dateB = fieldB ? parseISO(fieldB) : new Date(0);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortField === "serviceInterest") {
        const valueA = fieldA.join ? fieldA.join(", ") : "";
        const valueB = fieldB.join ? fieldB.join(", ") : "";
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return sortOrder === "asc"
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

    return result;
  }, [contacts, searchTerm, sortField, sortOrder, filterStatus, dateRange]);

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredAndSortedContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredAndSortedContacts.length / contactsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Card className="border-green-300 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="">
          <CardTitle className="text-3xl font-bold text-green-800 flex items-center">
            <User className="h-6 w-6 mr-2" />
            Contacts Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
              <Input
                placeholder="Search by name, email, company, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-300 focus:ring-green-500 text-green-900 rounded-lg"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 border-green-300 focus:ring-green-500 rounded-lg">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 rounded-lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                    : "Select Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Table */}
          <div className="SJoverflow-x-auto rounded-lg border border-green-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50 hover:bg-green-100">
                  <TableHead
                    className="cursor-pointer text-green-800 font-semibold"
                    onClick={() => handleSort("contactId")}
                  >
                    Contact ID
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-green-800 font-semibold"
                    onClick={() => handleSort("fullName")}
                  >
                    Full Name
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-green-800 font-semibold"
                    onClick={() => handleSort("email")}
                  >
                    Email
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-green-800 font-semibold"
                    onClick={() => handleSort("phone")}
                  >
                    Phone
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-green-800 font-semibold"
                    onClick={() => handleSort("companyName")}
                  >
                    Company
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead className="text-green-800 font-semibold">Status</TableHead>
                  <TableHead
                    className="cursor-pointer text-green-800 font-semibold"
                    onClick={() => handleSort("createdAt")}
                  >
                    Inquiry Date
                    <ArrowUpDown className="inline ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead className="text-green-800 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === "loading" ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                      <span className="text-green-700">Loading contacts...</span>
                    </TableCell>
                  </TableRow>
                ) : currentContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-green-700 text-lg">
                        No contacts found matching your criteria.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentContacts.map((contact) => (
                    <TableRow key={contact._id} className="hover:bg-green-50">
                      <TableCell>{contact.contactId || "N/A"}</TableCell>
                      <TableCell>{contact.fullName || "N/A"}</TableCell>
                      <TableCell>{contact.email || "N/A"}</TableCell>
                      <TableCell>{contact.phone || "N/A"}</TableCell>
                      <TableCell>{contact.companyName || "N/A"}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                            contact.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : contact.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {contact.status === "Accepted" ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : contact.status === "Pending" ? (
                            <AlertCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {contact.status || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {contact.createdAt
                          ? format(parseISO(contact.createdAt), "PPP")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-green-500 text-green-700 hover:bg-green-100"
                            onClick={() => handleViewContact(contact.contactId)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-green-500 text-green-700 hover:bg-green-100"
                            onClick={() => openStatusModal(contact.contactId)}
                            disabled={contact.status === "Accepted"}
                            title="Update Status"
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDeleteContact(contact.contactId)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {currentContacts.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-green-700">
                Showing {indexOfFirstContact + 1} to{" "}
                {Math.min(indexOfLastContact, filteredAndSortedContacts.length)} of{" "}
                {filteredAndSortedContacts.length} contacts
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-700 hover:bg-green-100"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={
                      currentPage === page
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "border-green-500 text-green-700 hover:bg-green-100"
                    }
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="border-green-500 text-green-700 hover:bg-green-100"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Contact Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={closeViewModal}>
        <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl cursor-pointer">
          <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
            <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
              <User className="h-6 w-6 mr-2" />
              Contact Details
            </DialogTitle>
          </DialogHeader>
          {status === "loading" && !selectedContact ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
              <span className="text-green-700">Loading contact details...</span>
            </div>
          ) : error && !selectedContact ? (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : selectedContact ? (
            <div className="space-y-4 text-green-900 p-6">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Contact ID:</strong> {selectedContact.contactId || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Full Name:</strong> {selectedContact.fullName || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Email:</strong> {selectedContact.email || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Phone:</strong> {selectedContact.phone || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Company:</strong> {selectedContact.companyName || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Designation:</strong> {selectedContact.designation || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Industry:</strong> {selectedContact.industry || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Location:</strong> {selectedContact.location || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Service Interest:</strong>{" "}
                  {selectedContact.serviceInterest?.join(", ") || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Referral Source:</strong> {selectedContact.referralSource || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Message:</strong> {selectedContact.message || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Feedback:</strong> {selectedContact.feedback || "Feedback not provided"}
                </p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                      selectedContact.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : selectedContact.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {selectedContact.status === "Accepted" ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : selectedContact.status === "Pending" ? (
                      <AlertCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {selectedContact.status || "N/A"}
                  </span>
                </p>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Created At:</strong>{" "}
                  {selectedContact.createdAt
                    ? format(parseISO(selectedContact.createdAt), "PPP")
                    : "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Updated At:</strong>{" "}
                  {selectedContact.updatedAt
                    ? format(parseISO(selectedContact.updatedAt), "PPP")
                    : "N/A"}
                </p>
              </div>
              
            </div>
          ) : (
            <div className="text-green-700 text-lg p-6">No contact selected.</div>
          )}
         
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={() => setIsStatusModalOpen(false)}>
        <DialogContent className="border-green-300 bg-green-50 rounded-2xl">
          <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
            <DialogTitle className="text-green-800 text-xl font-bold flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Update Contact Status
            </DialogTitle>
          </DialogHeader>
          {error && (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="p-4 space-y-4">
            <Select onValueChange={setNewStatus} value={newStatus}>
              <SelectTrigger className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <label className="text-green-800 font-semibold flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Feedback
              </label>
              <Input
                placeholder="Enter feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
              />
            </div>
            <Button
              className="bg-green-600 text-white hover:bg-green-700 w-full"
              onClick={handleStatusUpdate}
              disabled={!newStatus}
            >
              Submit
            </Button>
          </div>
          <DialogFooter className="p-4">
            <Button
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-100"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactsList;