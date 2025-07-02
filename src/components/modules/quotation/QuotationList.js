"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuotations,
  getQuotationById,
} from "@/store/features/quotationSlice";

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
import { Eye, ArrowLeft, Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QuotationList() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { quotations, quotation: selectedQuotation } = useSelector((state) => state.quotation);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingQuotation, setLoadingQuotation] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    dispatch(getQuotations());
  }, [dispatch]);

  const handleViewQuotation = async (quotationNumber) => {
    setShowPdf(false);
    setLoadingQuotation(true);
    const result = await dispatch(getQuotationById(quotationNumber));
    if (result?.payload) {
      setIsViewModalOpen(true);
    }
    setLoadingQuotation(false);
  };

  const handleViewPdf = async (quotationNumber) => {
    setShowPdf(true);
    setLoadingQuotation(true);
    const result = await dispatch(getQuotationById(quotationNumber));
    if (result?.payload) {
      setIsViewModalOpen(true);
    }
    setLoadingQuotation(false);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getPdfUrl = (quotationNumber) => `/api/quotations/pdf/${quotationNumber}`;

  return (
    <div>
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
                  onClick={() => setShowPdf((prev) => !prev)}
                >
                  {showPdf ? "Back to Details" : "View PDF"}
                </Button>
                {showPdf && selectedQuotation?.quotationNumber && (
                  <a
                    href={getPdfUrl(selectedQuotation.quotationNumber)}
                    download
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </DialogHeader>

          {loadingQuotation ? (
            <p className="text-gray-500">Loading quotation details...</p>
          ) : selectedQuotation?._id ? (
            showPdf ? (
              <iframe
                src={getPdfUrl(selectedQuotation.quotationNumber)}
                title="Quotation PDF"
                className="w-full h-[500px] border rounded"
              />
            ) : (
              <div className="space-y-4 text-sm">
                <p><strong>Quotation Number:</strong> {selectedQuotation.quotationNumber}</p>
                <p><strong>Contact ID:</strong> {selectedQuotation.contactId}</p>
                <p><strong>Title:</strong> {selectedQuotation.title}</p>
                <p><strong>Description:</strong> {selectedQuotation.description}</p>
                <p><strong>Scope of Work:</strong> {selectedQuotation.scopeOfWork}</p>

                <div>
                  <strong>Deliverables:</strong>
                  <ul className="list-disc ml-5">
                    {selectedQuotation?.deliverables?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Items:</strong>
                  <table className="w-full text-left border mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Service</th>
                        <th className="p-2">Base Price</th>
                        <th className="p-2">Sell Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation?.items?.map((item) => (
                        <tr key={item._id}>
                          <td className="p-2">{item.serviceName}</td>
                          <td className="p-2">{formatCurrency(item.basePrice)}</td>
                          <td className="p-2">{formatCurrency(item.sellPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p><strong>Timeline:</strong> {formatDate(selectedQuotation.timeline?.startDate)} - {formatDate(selectedQuotation.timeline?.endDate)}</p>
                <p><strong>Subtotal:</strong> {formatCurrency(selectedQuotation.subtotal)}</p>
                <p><strong>Tax:</strong> {selectedQuotation.taxPercent}% ({formatCurrency(selectedQuotation.taxAmount)})</p>
                <p><strong>Total:</strong> {formatCurrency(selectedQuotation.total)} {selectedQuotation.currency}</p>
                <p><strong>Payment Terms:</strong> {selectedQuotation.paymentTerms}</p>
                <p><strong>Terms & Conditions:</strong> {selectedQuotation.termsAndConditions}</p>
                <p><strong>Status:</strong> {selectedQuotation.status}</p>
                <p><strong>Responded At:</strong> {new Date(selectedQuotation.respondedAt).toLocaleString()}</p>
                <p><strong>Response Notes:</strong> {selectedQuotation.responseNotes}</p>
                <p><strong>Updated By:</strong> {selectedQuotation.updatedBy}</p>
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
                <TableHead className="w-20 text-center text-white font-semibold py-3 text-sm">S.No.</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 text-sm">Quotation Number</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 text-sm">Status</TableHead>
                <TableHead className="w-40 text-center text-white font-semibold py-3 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations?.length > 0 ? (
                quotations.map((quotation, index) => (
                  <TableRow key={quotation._id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">{quotation.quotationNumber}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize
                        ${quotation.status === "draft" ? "bg-gray-200 text-gray-800" :
                          quotation.status === "sent" ? "bg-blue-200 text-blue-800" :
                          quotation.status === "accepted" ? "bg-green-200 text-green-800" :
                          quotation.status === "rejected" ? "bg-red-200 text-red-800" :
                          quotation.status === "expired" ? "bg-yellow-200 text-yellow-800" :
                          "bg-slate-200 text-slate-800"}`}>
                        {quotation.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          title="View Details"
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewQuotation(quotation.quotationNumber)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
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
