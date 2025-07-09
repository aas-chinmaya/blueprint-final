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

{/* 
        <CardFooter className="pt-4">
  <Button
    className="w-full"
    variant={isPaid ? 'success' : 'default'}
    onClick={() => {
      const popup = window.open(
        paymentDetails.paymentLink,
        '_blank',
        'width=800,height=600,noopener,noreferrer'
      )
     
    }}
  >
    {isPaid ? 'View Receipt' : 'Pay Now'}
  </Button>
</CardFooter> */}



<CardFooter className="pt-4">
  <Button
    className="w-full"
    variant={isPaid ? 'success' : 'default'}
    onClick={() => {
      const popup = window.open(
        paymentDetails.paymentLink,
        '_blank',
        'width=800,height=600,noopener,noreferrer'
      );

      // Log window immediately
      console.log('Popup opened:', popup.location.pathname);

      // Try logging pathname repeatedly
      const interval = setInterval(() => {
        try {
          console.log('Popup path:', popup.location.pathname);

          // Optional: Stop if path contains Razorpay pattern
          if (popup.location.pathname.includes('/payment-link/')) {
            console.log('Matched Razorpay path:', popup.location.pathname);
            clearInterval(interval);
          }
        } catch (e) {
          console.log('Still waiting for same-origin page...');
        }
      }, 1000);

      // Stop checking after 15s
      setTimeout(() => {
        clearInterval(interval);
        console.log('Stopped checking after timeout.');
      }, 15000);
    }}
  >
    {isPaid ? 'View Receipt' : 'Pay Now'}
  </Button>
</CardFooter>


      </Card>
    </div>
  )
}

export default PaymentWithRedirect
