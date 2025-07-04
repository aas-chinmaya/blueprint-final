
'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getQuotations,
  getQuotationById,
} from '@/store/features/quotationSlice'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Eye, ArrowLeft, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function QuotationList() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { quotations, quotation: selectedQuotation } = useSelector((state) => state.quotation)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [loadingQuotation, setLoadingQuotation] = useState(false)
  const [showPdf, setShowPdf] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)

  useEffect(() => {
    dispatch(getQuotations())
  }, [dispatch])

  useEffect(() => {
    // Clean up Blob URL when component unmounts or modal closes
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const handleViewQuotation = async (quotationNumber) => {
    setShowPdf(false)
    setLoadingQuotation(true)
    const result = await dispatch(getQuotationById(quotationNumber))
    if (result?.payload) {
      setIsViewModalOpen(true)
    }
    setLoadingQuotation(false)
  }

  const handleViewPdf = (quotationNumber) => {
    setShowPdf(true)
    setLoadingQuotation(true)

    // Check if selectedQuotation has pdf data
    if (selectedQuotation?.pdf?.data?.length > 0) {
      try {
        // Convert pdf.data (array of bytes) to Uint8Array
        const uint8Array = new Uint8Array(selectedQuotation.pdf.data)
        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: 'application/pdf' })
        // Generate a URL for the Blob
        const blobUrl = URL.createObjectURL(blob)
        setPdfUrl(blobUrl)
      } catch (error) {
        console.error('Error creating PDF URL:', error)
        setPdfUrl(null)
      }
    } else {
      console.warn('No PDF data available in the response')
      setPdfUrl(null)
    }
    setLoadingQuotation(false)
  }

  const handleDownloadPdf = () => {
    if (pdfUrl && selectedQuotation?.quotationNumber) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `Quotation_${selectedQuotation.quotationNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-green-700 text-xl font-semibold">
                {showPdf ? 'Quotation PDF Preview' : 'Quotation Details'}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (showPdf) {
                      setShowPdf(false)
                      setPdfUrl(null) // Reset PDF URL
                    } else {
                      handleViewPdf(selectedQuotation?.quotationNumber)
                    }
                  }}
                >
                  {showPdf ? 'Back' : 'View PDF'}
                </Button>
                {showPdf && pdfUrl && selectedQuotation?.quotationNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPdf}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {loadingQuotation ? (
            <p className="text-gray-500">Loading quotation details...</p>
          ) : selectedQuotation?._id ? (
            showPdf ? (
              pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Quotation PDF"
                  className="w-full h-[80vh] border rounded"
                />
              ) : (
                <p className="text-red-500">No PDF data available for this quotation.</p>
              )
            ) : (
              <div className="space-y-4 text-sm">
                <p><strong>Quotation Number:</strong> {selectedQuotation.quotationNumber}</p>
                <p><strong>Contact ID:</strong> {selectedQuotation.contactId}</p>
                <p><strong>Title:</strong> {selectedQuotation.projectTitle}</p>
                <p><strong>Description:</strong> {selectedQuotation.description}</p>
                <p><strong>Scope of Work:</strong> {selectedQuotation.scopeOfWork}</p>
                <div>
                  <strong>Deliverables:</strong>
                  {Array.isArray(selectedQuotation?.deliverables) ? (
                    <ul className="list-disc ml-5">
                      {selectedQuotation.deliverables.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{selectedQuotation?.deliverables || 'No deliverables available'}</p>
                  )}
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
                <p><strong>Timeline:</strong> {selectedQuotation.timeline}</p>
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
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize
                        ${quotation.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                          quotation.status === 'sent' ? 'bg-blue-200 text-blue-800' :
                          quotation.status === 'accepted' ? 'bg-green-200 text-green-800' :
                          quotation.status === 'rejected' ? 'bg-red-200 text-red-800' :
                          quotation.status === 'expired' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-slate-200 text-slate-800'}`}
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
  )
}









