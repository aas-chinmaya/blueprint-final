
"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchClients } from "@/store/features/pre-project/clientSlice";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  X,
  ArrowUp,
  ArrowDown,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Laoder from "@/components/ui/loader";
import OnboardingMode from "./OnboardingMode"; // Assuming this is the path to your OnboardingMode component
export default function AllClientList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { clients, fetchClientsLoading, fetchClientsError } = useSelector((state) => state.client||[]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortField, setSortField] = useState("clientName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(13);
const [open, setOpen] = useState(false);

  const handleOnboarding = () => setOpen(true);



  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const clientStats = Array.isArray(clients)
    ? {
        total: clients.length,
        industries: [...new Set(clients.map((c) => c.industryType))].reduce((acc, industry) => {
          acc[industry] = clients.filter((c) => c.industryType === industry).length;
          return acc;
        }, {}),
      }
    : { total: 0, industries: {} };

  const filteredAndSortedClients = () => {
    if (!Array.isArray(clients)) return [];
    let filtered = clients;
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((client) => client.industryType === selectedIndustry);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.clientName?.toLowerCase().includes(term) ||
          client.clientId?.toString().includes(term) ||
          client.industryType?.toLowerCase().includes(term)
      );
    }
    return [...filtered].sort((a, b) => {
      const fieldA = a[sortField] || "";
      const fieldB = b[sortField] || "";
      return sortDirection === "asc"
        ? fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0
        : fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
    });
  };

  const sortedClients = filteredAndSortedClients();
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const paginatedClients = sortedClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (client) => router.push(`/client/edit/${client.clientId}`);
  const handleView = (client) => router.push(`/client/${client.clientId}`);
  // const handleOnboarding = () => router.push("/client/onboarding");
  // const handleOnboarding = () => router.push("/client/onboarding");
  const handleSort = (field) => {
    setSortField(field);
    setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };
  const handleIndustryFilter = (industry) => {
    setSelectedIndustry(industry);
    setIsFilterMenuOpen(false);
    setCurrentPage(1);
  };
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedIndustry("all");
    setSortField("clientName");
    setSortDirection("asc");
    setCurrentPage(1);
  };
  const handlePageChange = (page) => setCurrentPage(page);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (fetchClientsLoading) {
    return (
 
      <Laoder/>
    );
  }


  return (
    <div className=" flex flex-col justify-around ">
        {/* Header */}
        <div className=" border-b border-green-200 py-4 mb-6 rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-green-900">Client Directory</h1>
              <p className="text-green-700 text-sm">Manage your clients efficiently</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clients..."
                  className="pl-10 pr-10 py-2 text-sm border-green-300 focus:border-green-500 focus:ring-green-200 rounded-lg bg-white"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-green-600 hover:text-green-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <DropdownMenu open={isFilterMenuOpen} onOpenChange={setIsFilterMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-3 py-2 border-green-300 hover:bg-green-50 text-green-800 rounded-lg text-sm"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                      <ChevronDown className={cn("h-4 w-4", isFilterMenuOpen && "rotate-180")} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-white border-green-200 rounded-lg">
                    <DropdownMenuLabel className="font-semibold text-green-900 px-3 py-2 text-sm">Filter by Industry</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-green-100" />
                    <DropdownMenuItem
                      onClick={() => handleIndustryFilter("all")}
                      className={cn("px-3 py-2 text-sm cursor-pointer", selectedIndustry === "all" && "bg-green-50 text-green-900")}
                    >
                      <span className="mr-2">All Clients</span>
                      <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs mr-3">{clientStats.total}</span>
                    </DropdownMenuItem>
                    {Object.keys(clientStats.industries).map((industry) => (
                      <DropdownMenuItem
                        key={industry}
                        onClick={() => handleIndustryFilter(industry)}
                        className={cn("px-3 py-2 text-sm cursor-pointer", selectedIndustry === industry && "bg-green-50 text-green-900")}
                      >
                        <span className="mr-2">{industry}</span>
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">{clientStats.industries[industry]}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-green-100" />
                    <DropdownMenuLabel className="font-semibold text-green-900 px-3 py-2 text-sm">Sort Options</DropdownMenuLabel>
                    {[
                      { field: "clientName", label: "Client Name" },
                      { field: "clientId", label: "Client ID" },
                      { field: "industryType", label: "Industry" },
                    ].map((option) => (
                      <DropdownMenuItem
                        key={option.field}
                        onClick={() => handleSort(option.field)}
                        className={cn("px-3 py-2 text-sm cursor-pointer", sortField === option.field && "bg-green-50 text-green-900")}
                      >
                        <span>{option.label}</span>
                        {sortField === option.field && (sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-green-100" />
                    <DropdownMenuItem onClick={clearFilters} className="text-green-700 px-3 py-2 text-center cursor-pointer hover:bg-green-50 text-sm">
                      Clear All Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={handleOnboarding}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Client
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* onbaording mode choose modal */}
   <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="w-full max-w-xl p-0"> {/* no scroll or height here */}
    <OnboardingMode /> {/* full control inside this */}
  </DialogContent>
</Dialog>



        {/* No Clients Message */}
        {sortedClients.length === 0 && (
          <div className="bg-white rounded-lg border border-green-200 p-6 min-h-[75vh] text-center flex flex-col items-center justify-center ">
            <Search className="text-2xl text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">No clients found</h3>
            <p className="text-green-700 mb-4 text-sm">
              {selectedIndustry === "all" && !searchTerm ? "Add your first client to get started." : "No clients match your filters."}
            </p>
            {selectedIndustry !== "all" || searchTerm ? (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="flex items-center gap-2 mx-auto border-green-300 hover:bg-green-50 text-green-800 rounded-lg text-sm"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={handleOnboarding}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              >
                <Plus className="h-4 w-4" />
             Onboard Client
              </Button>
            )}
          </div>
        )}

        {/* Clients Table */}
        {sortedClients.length > 0 && (
          <div className="bg-white rounded-lg border border-green-200 overflow-hidden min-h-[75vh]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-green-600">
                  <TableRow className="border-0">
                    <TableHead className="w-12 text-center text-white font-semibold py-3 text-sm">S.No</TableHead>
                    <TableHead className="text-center text-white font-semibold py-3 text-sm">ID</TableHead>
                    <TableHead className="text-left text-white font-semibold py-3 min-w-[150px] text-sm">Client Name</TableHead>
                    <TableHead className="text-left text-white font-semibold py-3 min-w-[100px] text-sm">Industry</TableHead>
                    <TableHead className="text-center text-white font-semibold py-3 min-w-[90px] text-sm">Date</TableHead>
                    <TableHead className="w-16 text-center text-white font-semibold py-3 text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.map((client, index) => (
                    <TableRow
                      key={client.clientId}
                      className="hover:bg-green-50 border-green-100"
                    >
                      <TableCell className="text-center font-medium  py-2.5 text-sm">
                        {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="text-center font-mono  py-2.5 text-sm">
                        {client.clientId}
                      </TableCell>
                      <TableCell className="font-semibold  py-2.5 text-sm">
                        {client.clientName}
                      </TableCell>
                      <TableCell className="text-green-600 py-2.5 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {client.industryType}
                        </span>
                      </TableCell>
                      <TableCell className="text-center  py-2.5 text-sm">
                        {client.onboardingDate
                          ? new Date(client.onboardingDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "2-digit",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-center py-2.5">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(client)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100 h-7 w-7 rounded-md text-[#3B82F6]"
                            title="Edit Client"
                          >
                            <Edit className="h-4 w-4 " />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(client)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100 h-7 w-7 rounded-md"
                            title="View Client"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages >= 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-green-200 bg-green-50">
                <div className="text-sm text-green-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedClients.length)}</span> of{" "}
                  <span className="font-medium">{sortedClients.length}</span> clients
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 border-green-300 hover:bg-green-100 text-green-800 rounded-md text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <div key={index}>
                        {page === "..." ? (
                          <span className="px-2 py-1 text-green-600 text-sm">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              "w-8 h-8 rounded-md text-sm font-medium",
                              currentPage === page
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "border-green-300 hover:bg-green-100 text-green-800"
                            )}
                          >
                            {page}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 border-green-300 hover:bg-green-100 text-green-800 rounded-md text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
  );
}





