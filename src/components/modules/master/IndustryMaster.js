"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIndustries,
  addIndustry,
  getIndustryById,
  updateIndustry,
  deleteIndustry
} from "@/store/features/master/industriesMasterSlice";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Plus, Eye, Tag, Trash2, AlertCircle } from "lucide-react";

export default function Industry() {
  const dispatch = useDispatch();
  const { industries, selectedIndustry } = useSelector((state) => state.industries); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);
  const [industryToDelete, setIndustryToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [industriesPerPage, setIndustriesPerPage] = useState(5);
  const [goToPage, setGoToPage] = useState('');

  const [formData, setFormData] = useState({
    Industryname: "",
  });

  const handleReset = () => {
    setFormData({ Industryname: "" });
    setSelectedIndustryId(null);
  };

  // Load industries on component mount
  useEffect(() => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  // Reset to first page when industriesPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [industriesPerPage]);

  // Handle view industry
  const handleViewIndustry = (industryId) => {
    dispatch(getIndustryById(industryId));
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (industryId) => {
    dispatch(getIndustryById(industryId)).then((res) => {
      if (res.payload) {
        setFormData({
          Industryname: res.payload.Industryname || ""
        });
        setSelectedIndustryId(industryId);
        setIsEditModalOpen(true);
      }
    });
  };

  // Handle update
  const handleUpdate = (e) => {
    e.preventDefault();
    if (selectedIndustryId && formData.Industryname) {
      dispatch(updateIndustry({
        id: selectedIndustryId,
        Industryname: formData.Industryname
      }))
        .unwrap()
        .then(() => {
          toast.success("The industry was updated successfully."
          );
          setIsEditModalOpen(false);
          dispatch(fetchIndustries());
          handleReset();
        })
        .catch((err) => {
          toast.error(
            err?.message || "Failed to update industry",
            
          );
        });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addIndustry(formData)).unwrap();
      toast.success("The industry was added successfully."
      );
      setFormData({ Industryname: "" });
      document.getElementById("close-modal-btn")?.click();
      dispatch(fetchIndustries());
      setCurrentPage(1); // Reset to first page after adding an industry
    } catch (err) {
      toast.error(
        err?.message || "Failed to add industry"
        
      );
    }
  };

  // Pagination logic
  const indexOfLastIndustry = currentPage * industriesPerPage;
  const indexOfFirstIndustry = indexOfLastIndustry - industriesPerPage;
  const currentIndustries = industries.slice(indexOfFirstIndustry, indexOfLastIndustry);
  const totalPages = Math.ceil(industries.length / industriesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = parseInt(goToPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPage('');
    } else {
      toast.info( `Please enter a page number between 1 and ${totalPages}.`
      );
    }
  };

  return (
    <div>
      {/* Add Industry Modal */}
      <div className="flex justify-end mb-4">
        <Dialog onOpenChange={(isOpen) => {
          if (!isOpen) handleReset();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Industry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-green-800 font-bold text-2xl">Add New Industry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-green-600">Industry Name</label>
                <Input
                  name="Industryname"
                  value={formData.Industryname}
                  onChange={handleChange}
                  required
                  className="border-green-400 focus:ring-green-500"
                />
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="text-gray-600 hover:bg-gray-100">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Industry Table */}
      <div className="bg-white rounded-lg border border-green-200 overflow-hidden min-h-[75vh]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-green-600">
              <TableRow className="border-0">
                <TableHead className="w-36 text-center text-white font-semibold py-3 text-sm">S.No.</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 text-sm">Industry ID</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 min-w-[150px] text-sm">Industry Name</TableHead>
                <TableHead className="w-36 text-center text-white font-semibold py-3 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentIndustries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 italic">
                    No industries available.
                  </TableCell>
                </TableRow>
              ) : (
                currentIndustries.map((industry, index) => (
                  <TableRow key={industry._id}>
                    <TableCell className="text-center">{indexOfFirstIndustry + index + 1}</TableCell>
                    <TableCell className="text-center">{industry.industryId}</TableCell>
                    <TableCell className="text-center">{industry.Industryname}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 justify-center">
                        <Button
                          className="border-green-500 text-green-700 hover:bg-green-100"
                          title="View"
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewIndustry(industry.industryId)}
                        >
                          <Eye className="h-4 w-4"/>
                        </Button>
                        <Button
                          className="border-green-500 text-green-700 hover:bg-green-100"
                          title="Edit"
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(industry.industryId)}
                        >
                          <Tag className="h-4 w-4"/>
                        </Button>
                        <Button
                          className="border-red-500 text-red-700 hover:bg-red-100"
                          title="Delete"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setIndustryToDelete(industry.industryId);
                            setIsDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4"/>
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
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 p-4">
            {/* Items per page selector */}
            <div className="flex items-center space-x-2">
              <label htmlFor="industriesPerPage" className="text-green-700">Industries per page:</label>
              <Select
                value={industriesPerPage.toString()}
                onValueChange={(value) => setIndustriesPerPage(Number(value))}
              >
                <SelectTrigger className="w-24 border-green-400 focus:ring-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-green-600 hover:bg-green-100"
              >
                Previous
              </Button>
              {[...Array(totalPages).keys()].map((page) => (
                <Button
                  key={page + 1}
                  variant={currentPage === page + 1 ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    currentPage === page + 1
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'text-green-600 hover:bg-green-100'
                  }
                >
                  {page + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-green-600 hover:bg-green-100"
              >
                Next
              </Button>
            </div>

            {/* Go to page input */}
            <div className="flex items-center space-x-2">
              <label htmlFor="goToPage" className="text-green-700">Go to page:</label>
              <Input
                id="goToPage"
                type="number"
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                className="w-20 border-green-400 focus:ring-green-500"
                placeholder="Page"
              />
              <Button
                onClick={handleGoToPage}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Go
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Industry Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-green-800 font-bold text-2xl flex items-center gap-2">
              <Eye className="h-5 w-5" /> Industry Details
            </DialogTitle>
          </DialogHeader>
          {selectedIndustry ? (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-green-600">Industry Name</label>
                <p className="text-gray-700">{selectedIndustry.Industryname}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">Loading...</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Industry Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => {
        setIsEditModalOpen(isOpen);
        if (!isOpen) handleReset();
      }}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-green-800 font-bold text-2xl flex items-center gap-2">
              <Tag className="h-5 w-5" /> Edit Industry
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-green-600">Industry Name</label>
              <Input
                name="Industryname"
                value={formData.Industryname}
                onChange={handleChange}
                required
                className="border-green-400 focus:ring-green-500"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={(isOpen) => {
        setIsDeleteConfirmOpen(isOpen);
        if (!isOpen) setIndustryToDelete(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" /> Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete Industry #{industryToDelete}? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setIndustryToDelete(null);
                }}
                className="text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (industryToDelete) {
                  dispatch(deleteIndustry(industryToDelete))
                    .unwrap()
                    .then(() => {
                      toast({
                        title: "Deleted",
                        description: "Industry deleted successfully.",
                      });
                      dispatch(fetchIndustries());
                      setCurrentPage(1); // Reset to first page after deletion
                    })
                    .catch((err) => {
                      toast({
                        title: "Error",
                        description: err?.message || "Failed to delete industry",
                        variant: "destructive",
                      });
                    })
                    .finally(() => {
                      setIsDeleteConfirmOpen(false);
                      setIndustryToDelete(null);
                    });
                }
              }}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}