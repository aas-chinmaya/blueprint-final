'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  addService,
  getServiceById,
  updateService,
  deleteService,
} from '@/store/features/master/serviceMasterSlice';
import { PlusCircle, Eye, Tag, Trash2, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Service() {
  
  const dispatch = useDispatch();
  const { services, selectedService } = useSelector((state) => state.services);
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage, setServicesPerPage] = useState(5);
  const [goToPage, setGoToPage] = useState('');

  const handleReset = () => {
    setFormData({ name: '', description: '', basePrice: '' });
    setSelectedServiceId(null);
  };

  // Load services on component mount
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Reset to first page when servicesPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [servicesPerPage]);

  // Handle view service
  const handleViewService = (serviceId) => {
    dispatch(getServiceById(serviceId));
    setOpenView(true);
  };

  // Open edit modal
  const openEditModal = (serviceId) => {
    dispatch(getServiceById(serviceId)).then((res) => {
      if (res.payload) {
        setFormData({
          name: res.payload.name || '',
          description: res.payload.description || '',
          basePrice: res.payload.basePrice || '',
        });
        setSelectedServiceId(serviceId);
        setOpenEdit(true);
      }
    });
  };

  // Handle update
  const handleUpdate = (e) => {
    e.preventDefault();
    if (selectedServiceId && formData.name && formData.description && formData.basePrice) {
      dispatch(
        updateService({
          id: selectedServiceId,
          name: formData.name,
          description: formData.description,
          basePrice: formData.basePrice,
        })
      )
        .unwrap()
        .then(() => {
          toast.success(
           'The service was updated successfully.'
          );
          setOpenEdit(false);
          dispatch(fetchServices());
          handleReset();
        })
        .catch((err) => {
          toast.error( err?.message || 'Failed to update service',
            
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
      await dispatch(addService(formData)).unwrap();
      toast.success('service added successfully.'
      );
      setFormData({ name: '', description: '', basePrice: '' });
      setOpenCreate(false);
      dispatch(fetchServices());
      setCurrentPage(1); // Reset to first page after adding a service
    } catch (err) {
      toast.error(
       err?.message || 'Failed to add service',
       
      );
    }
  };

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(services.length / servicesPerPage);

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
    <>
      <Card className="max-w-full shadow-xl border-0 h-full">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Tag className="w-6 h-6" />
              <CardTitle className="text-2xl">Service Master</CardTitle>
            </div>
            <Dialog open={openCreate} onOpenChange={(open) => {
              setOpenCreate(open);
              if (!open) handleReset();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-white text-green-600 hover:bg-gray-100 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-green-700">
                    <PlusCircle className="w-5 h-5" />
                    Add New Service
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details for the new service.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-green-700">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-green-400 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-green-700">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="border-green-400 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basePrice" className="text-green-700">Base Price</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleChange}
                      className="border-green-400 focus:ring-green-500"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpenCreate(false)}
                      className="text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Save Service
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 space-y-6">
          {/* Services List */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-green-700 mb-4">All Services</h2>
            {services.length === 0 ? (
              <p className="text-gray-500 italic">No services available.</p>
            ) : (
              <div className="space-y-3">
                {currentServices.map((service) => (
                  <Card
                    key={service.serviceId}
                    className="bg-green-50 border-green-200 hover:bg-green-100 transition"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-green-700">
                          Service #{service.serviceId}: {service.name}
                        </span>
                        <span className="text-sm text-gray-600">{service.description}</span>
                        <span className="text-sm text-gray-600">Base Price: ${service.basePrice}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewService(service.serviceId)}
                          className="hover:bg-green-200"
                          title="View"
                        >
                          <Eye className="w-5 h-5 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(service.serviceId)}
                          className="hover:bg-green-200"
                          title="Edit"
                        >
                          <Tag className="w-5 h-5 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setServiceToDelete(service.serviceId);
                            setOpenDelete(true);
                          }}
                          className="hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="servicesPerPage" className="text-green-700">Services per page:</Label>
                <Select
                  value={servicesPerPage.toString()}
                  onValueChange={(value) => setServicesPerPage(Number(value))}
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
                <Label htmlFor="goToPage" className="text-green-700">Go to page:</Label>
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
        </CardContent>
      </Card>

      {/* View Service Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <Eye className="w-5 h-5" />
              Service Details
            </DialogTitle>
          </DialogHeader>
          {selectedService ? (
            <div className="space-y-4">
              <div>
                <Label className="text-green-700">Name</Label>
                <p className="text-gray-700">{selectedService.name}</p>
              </div>
              <div>
                <Label className="text-green-700">Description</Label>
                <p className="text-gray-700">{selectedService.description}</p>
              </div>
              <div>
                <Label className="text-green-700">Base Price</Label>
                <p className="text-gray-700">{selectedService.basePrice}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenView(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={openEdit} onOpenChange={(open) => {
        setOpenEdit(open);
        if (!open) handleReset();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <Tag className="w-5 h-5" />
              Edit Service
            </DialogTitle>
            <DialogDescription>
              Update the details for the service.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-700">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-green-400 focus:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-green-700">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border-green-400 focus:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice" className="text-green-700">Base Price</Label>
              <Input
                id="basePrice"
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                className="border-green-400 focus:ring-green-500"
                required
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenEdit(false)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={(open) => {
        setOpenDelete(open);
        if (!open) setServiceToDelete(null);
      }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-6 h-6" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Service #{serviceToDelete}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenDelete(false);
                setServiceToDelete(null);
              }}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (serviceToDelete) {
                  dispatch(deleteService(serviceToDelete))
                    .unwrap()
                    .then(() => {
                      toast({
                        title: 'Deleted',
                        description: 'Service deleted successfully.',
                      });
                      dispatch(fetchServices());
                      setCurrentPage(1); // Reset to first page after deletion
                    })
                    .catch((err) => {
                      toast({
                        title: 'Error',
                        description: err?.message || 'Failed to delete service',
                        variant: 'destructive',
                      });
                    })
                    .finally(() => {
                      setOpenDelete(false);
                      setServiceToDelete(null);
                    });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}