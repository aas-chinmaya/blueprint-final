
"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAllApprovedContacts } from "@/store/features/contactSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ArrowUpDown,
  Eye,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const ContactMeetingsManager = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { Approvedcontacts, status } = useSelector((state) => state.contact);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch contacts on component mount
  useEffect(() => {
    dispatch(getAllApprovedContacts());
  }, [dispatch]);

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
    let result = [...Approvedcontacts];

    // Filter out deleted contacts
    result = result.filter((contact) => !contact.isDeleted);

    // Search
    if (searchTerm) {
      result = result.filter(
        (contact) =>
          (contact.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.contactId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.companyName || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      const fieldA = a[sortField] || "";
      const fieldB = b[sortField] || "";
      return sortOrder === "asc"
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

    return result;
  }, [Approvedcontacts, searchTerm, sortField, sortOrder]);

  // Handle view meetings
  const handleViewMeetings = (contactId) => {
    router.push(`/meetings/${contactId}`);
  };

  return (
    <div className="min-h-screen p-6">
      <Card className="border-green-300 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-800 flex items-center">
            <User className="h-6 w-6 mr-2" />
            Meetings Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search */}
          <div className="relative flex-1 mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
            <Input
              placeholder="Search by name, email, company, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-300 focus:ring-green-500 text-green-900 rounded-lg"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-green-200">
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
                  <TableHead className="text-green-800 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === "loading" ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
                      <span className="text-green-700">Loading contacts...</span>
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-green-700 text-lg">
                        No contacts found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedContacts.map((contact) => (
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
                          {contact.status || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-green-500 text-green-700 hover:bg-green-100"
                          onClick={() => handleViewMeetings(contact.contactId)}
                          title="View Meetings"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactMeetingsManager;