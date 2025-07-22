"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  addService,
  getServiceById,
  updateService,
  deleteService,
} from "@/features/master/serviceMasterSlice";
import { validateInput } from "@/utils/sanitize";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Plus,
  Eye,
  Tag,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Service() {
  const dispatch = useDispatch();
  const { services, status } = useSelector((state) => state.services);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage, setServicesPerPage] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 10
  );
  const [inputError, setInputError] = useState("");
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setServicesPerPage(window.innerWidth < 768 ? 5 : 10);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReset = () => {
    setFormData({ name: "", description: "", basePrice: "" });
    setSelectedServiceId(null);
    setInputError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validation = validateInput(value);

    if (!validation.isValid) {
      setInputError(validation.warning);
    } else {
      setInputError("");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = async (id) => {
    try {
      const res = await dispatch(getServiceById(id)).unwrap();
      if (res) {
        setFormData({
          name: res.name || "",
          description: res.description || "",
          basePrice: res.basePrice || "",
        });
        setSelectedServiceId(id);
        setIsModalOpen(true);
      } else {
        toast.error("Failed to load service.");
      }
    } catch {
      toast.error("Error fetching service.");
    }
  };

  const openViewModal = async (id) => {
    try {
      const res = await dispatch(getServiceById(id)).unwrap();
      if (res) {
        setViewData(res);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to load service.");
      }
    } catch {
      toast.error("Error loading service.");
    }
  };

  const handleSubmit = async () => {
    const { name, description, basePrice } = formData;

    // Validate all fields
    const nameValidation = validateInput(name);
    const descriptionValidation = validateInput(description);
    const priceValidation = validateInput(basePrice);

    if (
      !nameValidation.isValid ||
      !descriptionValidation.isValid ||
      !priceValidation.isValid
    ) {
      toast.warning("Please fix validation errors.");
      return;
    }

    try {
      if (selectedServiceId) {
        await dispatch(
          updateService({ id: selectedServiceId, ...formData })
        ).unwrap();
        toast.success("Service updated successfully.");
      } else {
        await dispatch(addService(formData)).unwrap();
        toast.success("Service created successfully.");
      }

      setIsModalOpen(false);
      handleReset();
      dispatch(fetchServices());
    } catch (err) {
      toast.error(err?.message || "Operation failed.");
    }
  };

  const sortedServices = [...services];
  const totalItems = sortedServices.length;
  const totalPages = Math.ceil(totalItems / servicesPerPage);
  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;
  const currentServices = sortedServices.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <Dialog
          open={isModalOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) handleReset();
            setIsModalOpen(isOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Service
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedServiceId ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="mb-2">Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="mb-2">Description *</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="mb-2">Base Price *</Label>
                <Input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {inputError && (
                <p className="text-sm text-danger mt-1">{inputError}</p>
              )}
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSubmit}>
                  {selectedServiceId ? "Save Changes" : "Create"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="text-center w-20">S.No.</TableHead>
                <TableHead className="text-center">Service Name</TableHead>
                <TableHead className="text-center">Description</TableHead>
                <TableHead className="text-center">Base Price</TableHead>
                <TableHead className="text-center w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status === "loading" ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : totalItems === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground h-[80vh]"
                  >
                    <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                    No services found.
                  </TableCell>
                </TableRow>
              ) : (
                currentServices.map((service, index) => (
                  <TableRow key={service._id}>
                    <TableCell className="text-center">
                      {indexOfFirst + index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      {service.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {service.description}
                    </TableCell>
                    <TableCell className="text-center">
                      INR {service.basePrice}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewModal(service.serviceId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(service.serviceId)}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-danger"
                          onClick={() => {
                            setServiceToDelete(service.serviceId);
                            setIsDeleteConfirmOpen(true);
                          }}
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
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {currentServices.length} of {totalItems} services
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Rows:</Label>
                <Select
                  value={servicesPerPage.toString()}
                  onValueChange={(value) => {
                    setServicesPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-2 text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <Dialog
        open={isDeleteConfirmOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setServiceToDelete(null);
          setIsDeleteConfirmOpen(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-danger">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (serviceToDelete) {
                  dispatch(deleteService(serviceToDelete))
                    .unwrap()
                    .then(() => {
                      toast.success("Service deleted successfully.");
                      dispatch(fetchServices());
                      setCurrentPage(1);
                    })
                    .catch(() => {
                      toast.error("Failed to delete service.");
                    })
                    .finally(() => {
                      setIsDeleteConfirmOpen(false);
                      setServiceToDelete(null);
                    });
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open) => {
          if (!open) setViewData(null);
          setIsViewModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Service Details</DialogTitle>
          </DialogHeader>
          {viewData ? (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="font-semibold">Name:</Label>
                <p className="text-muted-foreground">{viewData.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Description:</Label>
                <p className="text-muted-foreground">{viewData.description}</p>
              </div>
              <div>
                <Label className="font-semibold">Base Price:</Label>
                <p className="text-muted-foreground">
                  INR : {viewData.basePrice}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading service details...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
