
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllSlots,
  createSlot,
  deleteSlot,
} from '@/store/features/master/slotMasterSlice';
import { PlusCircle, Clock, Trash2, AlertCircle } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

export default function SlotMaster() {
  
  const dispatch = useDispatch();
  const { slots, loading, error } = useSelector((state) => state.slots);

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [shift, setShift] = useState('');
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage, setSlotsPerPage] = useState(5);
  const [goToPage, setGoToPage] = useState('');

  // Fetch slots on component mount
  useEffect(() => {
    dispatch(fetchAllSlots());
  }, [dispatch]);

  // Reset to first page when slotsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slotsPerPage]);

  // Automatically set shift based on startTime
  useEffect(() => {
    if (startTime) {
      const [hours] = startTime.split(':').map(Number);
      if (hours >= 0 && hours < 12) {
        setShift('Morning');
      } else if (hours >= 12 && hours < 16) {
        setShift('Day');
      } else if (hours >= 16 && hours < 20) {
        setShift('Afternoon');
      } else {
        setShift('Evening');
      }
    } else {
      setShift('');
    }
  }, [startTime]);

  // Calculate statistics
  const stats = slots.reduce(
    (acc, slot) => {
      acc[slot.shift] = (acc[slot.shift] || 0) + 1;
      return acc;
    },
    { Morning: 0, Day: 0, Afternoon: 0, Evening: 0 }
  );

  // Handle slot creation
  const handleCreate = () => {
    if (!startTime || !endTime || !shift) {
      toast.error('All fields are required');
      return;
    }

    dispatch(createSlot({ startTime, endTime, shift }))
      .unwrap()
      .then(() => {
        toast.success('Slot created!');
        setStartTime('');
        setEndTime('');
        setShift('');
        setOpenCreate(false);
        setCurrentPage(1); // Reset to first page after adding a slot
      })
      .catch((err) => toast.error(err));
  };

  // Handle opening delete confirmation
  const handleOpenDelete = (slotNo) => {
    setSlotToDelete(slotNo);
    setOpenDelete(true);
  };

  // Handle slot deletion
  const handleDelete = () => {
    if (slotToDelete) {
      dispatch(deleteSlot(slotToDelete))
        .unwrap()
        .then(() => {
          toast.success('Slot deleted!');
          setOpenDelete(false);
          setSlotToDelete(null);
          setCurrentPage(1); // Reset to first page after deletion
        })
        .catch((err) => toast.error(err));
    }
  };

  // Pagination logic
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);
  const totalPages = Math.ceil(slots.length / slotsPerPage);

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
      toast.info(`Please enter a page number between 1 and ${totalPages}.`);
    }
  };

  return (
    <div className="">
      <Card className=" mx-auto shadow-xl border-0">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              <CardTitle className="text-2xl">Slot Master</CardTitle>
            </div>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button className="bg-white text-green-600 hover:bg-gray-100 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Create Slot
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-green-700">
                    <Clock className="w-5 h-5" />
                    Create New Slot
                  </DialogTitle>
                  <DialogDescription>
                    Enter the time details for the new slot. Shift will be set automatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-green-700">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border-green-400 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-green-700">
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border-green-400 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift" className="text-green-700">
                      Shift
                    </Label>
                    <Select value={shift} onValueChange={setShift} disabled>
                      <SelectTrigger className="border-green-400 focus:ring-green-500">
                        <SelectValue placeholder="Select Shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Day">Day</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    onClick={handleCreate}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Slot
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Morning', 'Day', 'Afternoon', 'Evening'].map((shift) => (
              <Card
                key={shift}
                className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200 shadow-sm"
              >
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-600">{shift}</h3>
                  <p className="text-2xl font-bold text-green-600">{stats[shift]}</p>
                  <p className="text-xs text-gray-500">Total Slots</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Slots List */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-green-700 mb-4">All Slots</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : slots.length === 0 ? (
              <p className="text-gray-500 italic">No slots available.</p>
            ) : (
              <div className="space-y-3">
                {currentSlots.map((slot) => (
                  <Card
                    key={slot._id}
                    className="bg-green-50 border-green-200 hover:bg-green-100 transition"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-green-700">
                          Slot {slot.slotNo}: {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="text-sm text-gray-600">{slot.shift}</span>
                        <span className="text-xs text-gray-400">
                          Created: {new Date(slot.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(slot.slotNo)}
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </Button>
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
                <Label htmlFor="slotsPerPage" className="text-green-700">Slots per page:</Label>
                <Select
                  value={slotsPerPage.toString()}
                  onValueChange={(value) => setSlotsPerPage(Number(value))}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={(open) => {
        setOpenDelete(open);
        if (!open) setSlotToDelete(null);
      }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-6 h-6" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Slot {slotToDelete}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenDelete(false);
                setSlotToDelete(null);
              }}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}