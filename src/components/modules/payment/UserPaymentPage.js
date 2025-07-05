'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePaymentDetails } from '@/hooks/usepaymentDetails'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoaderCircle } from 'lucide-react'

const PaymentWithRedirect = () => {
  const searchParams = useSearchParams()
  const contactId = searchParams.get('contactId')
  const [paymentDetails, setPaymentDetails] = useState(null)

  const paymentData = usePaymentDetails(contactId)

  useEffect(() => {
    if (paymentData) {
      setPaymentDetails(paymentData)
    }
  }, [paymentData])

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const isPaid = paymentDetails.status === 'paid'

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Payment Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Contact ID:</span>
            <span>{paymentDetails.contactId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{paymentDetails.contactEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span>₹{paymentDetails.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <Badge variant="outline" className={isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
{paymentDetails?.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status Code:</span>
            <span>{paymentDetails.statusCode}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-4">
          {isPaid ? (
            <Button
              className="w-full"
              variant="success"
              asChild
            >
              <a href={paymentDetails.paymentLink}>View Receipt</a>
            </Button>
          ) : (
            <Button
              className="w-full"
              variant="default"
              asChild
            >
              <a href={paymentDetails.paymentLink} target="_blank" rel="noopener noreferrer">
                Pay Now
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default PaymentWithRedirect
