'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPaymentStatusByPaymentId } from '@/store/features/meeting/paymentSlice'

const PaymentStatusViewer = () => {
  const dispatch = useDispatch()
const paymentId ="plink_Qq8AehMFd6oQ7U";

  const {
    getPaymentStatusByPaymentIdStatus,
    paymentStatusResult,
    error
  } = useSelector((state) => state.payment)

  useEffect(() => {
    if (paymentId) {
      dispatch(getPaymentStatusByPaymentId(paymentId))
    }
  }, [paymentId, dispatch])
  console.log('Payment Status:', paymentStatusResult)

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Payment Status</h2>

      {/* {getPaymentStatusByPaymentIdStatus === 'processing' && (
        <p className="text-blue-500">Loading payment details...</p>
      )}

      {getPaymentStatusByPaymentIdStatus === 'error' && (
        <p className="text-red-500">Error: {error}</p>
      )}

      {getPaymentStatusByPaymentIdStatus === 'success' && paymentStatusResult && (
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>Payment ID:</strong> {paymentStatusResult.paymentId}</p>
          <p><strong>Status:</strong> {paymentStatusResult.status}</p>
          <p><strong>Amount:</strong> ₹{paymentStatusResult.amount}</p>
          <p><strong>Contact Email:</strong> {paymentStatusResult.email}</p>
        </div>
      )} */}
    </div>
  )
}

export default PaymentStatusViewer
