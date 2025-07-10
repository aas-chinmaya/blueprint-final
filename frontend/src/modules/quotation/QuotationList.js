

// QuotationList.js
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuotations,
  getQuotationById,
} from "@/store/features/pre-project/quotationSlice";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Eye, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Utility function to calculate totals
const calculateTotals = (quotation) => {
  const subtotal = quotation.items.reduce(
    (sum, item) => sum + Number(item.sellPrice || 0),
    0
  );
  const taxAmount = subtotal * (quotation.taxPercent / 100);
  const total = subtotal + taxAmount;

  return {
    ...quotation,
    subtotal: subtotal.toFixed(2), // e.g., "173.00"
    taxAmount: taxAmount.toFixed(2), // e.g., "31.14"
    total: total.toFixed(2), // e.g., "204.14"
  };
};

export default function QuotationList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { quotations, quotation: selectedQuotation } = useSelector(
    (state) => state.quotation
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingQuotation, setLoadingQuotation] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch all quotations on component mount
  useEffect(() => {
    dispatch(getQuotations());
  }, [dispatch]);

  // Handle viewing a specific quotation
  const handleViewQuotation = async (quotationNumber) => {
    setShowPdf(false);
    setPdfUrl(null);
    setLoadingQuotation(true);
    const result = await dispatch(getQuotationById(quotationNumber));
    if (result?.payload) {
      setIsViewModalOpen(true);
    }
    setLoadingQuotation(false);
  };

  // Handle PDF view toggle
  const handleViewPdf = () => {
    setShowPdf(true);
    setLoadingQuotation(true);

    if (
      typeof selectedQuotation?.pdfUrl === "string" &&
      selectedQuotation.pdfUrl.trim() !== ""
    ) {
      setPdfUrl(selectedQuotation.pdfUrl);
    } else {
      setPdfUrl(null);
    }

    setLoadingQuotation(false);
  };

  // Format currency in INR with two decimal places
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(Number(amount));

  // Format date to DD-MMM-YYYY
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Calculate totals for selectedQuotation if not provided
  const computedQuotation = selectedQuotation?._id
    ? calculateTotals(selectedQuotation)
    : null;

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-green-700 text-xl font-semibold">
                {showPdf ? "Quotation PDF Preview" : "Quotation Details"}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (showPdf) {
                      setShowPdf(false);
                      setPdfUrl(null);
                    } else {
                      handleViewPdf();
                    }
                  }}
                >
                  {showPdf ? "Back" : "View PDF"}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {loadingQuotation ? (
            <p className="text-gray-500">Loading quotation details...</p>
          ) : computedQuotation?._id ? (
            showPdf ? (
              pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Quotation PDF"
                  className="w-full h-[80vh] border rounded"
                />
              ) : (
                <p className="text-red-500">
                  PDF not available for this quotation.
                </p>
              )
            ) : (
              <div className="w-full space-y-6 text-sm text-gray-800">
                {/* Header */}
                <div className="border-b pb-2">
                  <p className="text-xs text-gray-500">
                    Quotation Number:{" "}
                    <span className="font-medium">
                      {computedQuotation?.quotationNumber}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Valid Till:{" "}
                    <span className="font-medium">
                      {formatDate(computedQuotation?.validTill)}
                    </span>
                  </p>
                </div>

                {/* Client & Provider Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-1">
                    <h3 className="text-green-800 font-semibold text-sm mb-2">
                      Client Information
                    </h3>
                    <p>
                      <strong>Name:</strong>{" "}
                      {computedQuotation?.clientDetails?.name}
                    </p>
                    <p>
                      <strong>Company:</strong>{" "}
                      {computedQuotation?.clientDetails?.company}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {computedQuotation?.clientDetails?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {computedQuotation?.clientDetails?.phone}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-1">
                    <h3 className="text-green-800 font-semibold text-sm mb-2">
                      Prepared By
                    </h3>
                    <p>
                      <strong>Name:</strong>{" "}
                      {computedQuotation?.preparedBy?.name}
                    </p>
                    <p>
                      <strong>Designation:</strong>{" "}
                      {computedQuotation?.preparedBy?.designation}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {computedQuotation?.preparedBy?.email}
                    </p>
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-1">
                  <h3 className="text-green-800 font-semibold text-sm">
                    Project Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p className="col-span-2">
                      <strong>Title:</strong> {computedQuotation?.projectTitle}
                    </p>
                    <p className="col-span-2">
                      <strong>Timeline:</strong> {computedQuotation?.timeline}
                    </p>
                    <p className="col-span-2">
                      <strong>Scope of Work:</strong>{" "}
                      {computedQuotation?.scopeOfWork}
                    </p>
                    <p className="col-span-2">
                      <strong>Deliverables:</strong>{" "}
                      {computedQuotation?.deliverables}
                    </p>
                  </div>
                </div>

                {/* Quotation Items */}
                <div className="space-y-2">
                  <h3 className="text-green-800 font-semibold text-sm">
                    Quotation Items
                  </h3>
                  <div className="overflow-auto rounded-md border border-gray-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-green-100 text-green-800">
                        <tr>
                          <th className="px-4 py-2 text-left">Service</th>
                          <th className="px-4 py-2 text-right">Sell Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {computedQuotation?.items?.map((item) => (
                          <tr key={item._id}>
                            <td className="px-4 py-2">{item.serviceName}</td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(item.sellPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-2">
                    <h3 className="text-green-800 font-semibold text-sm">
                      Payment & Tax Info
                    </h3>
                    <p>
                      <strong>Tax Percent:</strong>{" "}
                      {computedQuotation?.taxPercent}%
                    </p>
                    <p>
                      <strong>Payment Terms:</strong>{" "}
                      {computedQuotation?.paymentTerms}
                    </p>
                    <p>
                      <strong>Terms & Conditions:</strong>{" "}
                      {computedQuotation?.termsAndConditions}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-2">
                    <h3 className="text-green-800 font-semibold text-sm">
                      Totals
                    </h3>
                    <p>
                      <strong>Subtotal:</strong>{" "}
                      {formatCurrency(computedQuotation?.subtotal)}
                    </p>
                    <p>
                      <strong>Tax Amount:</strong>{" "}
                      {formatCurrency(computedQuotation?.taxAmount)}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      {formatCurrency(computedQuotation?.total)}{" "}
                      {computedQuotation?.currency}
                    </p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Status:</strong> {computedQuotation?.status}
                  </p>
                  {computedQuotation?.respondedAt && (
                    <p>
                      <strong>Responded At:</strong>{" "}
                      {new Date(computedQuotation.respondedAt).toLocaleString()}
                    </p>
                  )}
                  {computedQuotation?.responseNotes && (
                    <p>
                      <strong>Response Notes:</strong>{" "}
                      {computedQuotation.responseNotes}
                    </p>
                  )}
                  <p>
                    <strong>Created By:</strong> {computedQuotation?.createdBy}
                  </p>
                  {computedQuotation?.updatedBy && (
                    <p>
                      <strong>Updated By:</strong> {computedQuotation.updatedBy}
                    </p>
                  )}
                </div>
              </div>
            )
          ) : (
            <p className="text-gray-500">No quotation found.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Back Button */}
      <div className="mb-6">
        <Button variant="back" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
      </div>

      {/* Quotation Table */}
      <div className="bg-white rounded-lg border border-green-200 overflow-hidden min-h-[75vh]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-green-600">
              <TableRow className="border-0">
                <TableHead className="w-20 text-center text-white font-semibold py-3 text-sm">
                  S.No.
                </TableHead>
                <TableHead className="text-center text-white font-semibold py-3 text-sm">
                  Quotation Number
                </TableHead>
                <TableHead className="text-center text-white font-semibold py-3 text-sm">
                  Status
                </TableHead>
                <TableHead className="w-40 text-center text-white font-semibold py-3 text-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations?.length > 0 ? (
                quotations.map((quotation, index) => (
                  <TableRow key={quotation._id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">
                      {quotation.quotationNumber}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize
                        ${
                          quotation.status === "draft"
                            ? "bg-gray-200 text-gray-800"
                            : quotation.status === "sent"
                            ? "bg-blue-200 text-blue-800"
                            : quotation.status === "accepted"
                            ? "bg-green-200 text-green-800"
                            : quotation.status === "rejected"
                            ? "bg-red-200 text-red-800"
                            : quotation.status === "expired"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        {quotation.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          title="View Details"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleViewQuotation(quotation.quotationNumber)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    No quotations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}