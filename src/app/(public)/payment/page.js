


'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { getPaymentLinkDetailsByContactId, sendStatusCode, verifyStatusCode } from '@/store/features/meeting/paymentSlice'

const PaymentWithRedirect = () => {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const contactIdFromURL = searchParams.get('contactId')
const { paymentLinkRecord, getPaymentLinkStatus, error } = useSelector(
    (state) => state.payment
  )
  useEffect(() => {
    if (contactIdFromURL) {
      dispatch(getPaymentLinkDetailsByContactId(contactIdFromURL))
    }
  }, [contactIdFromURL, dispatch])

  console.log("fgWER",paymentLinkRecord)
  const paymentUrl = paymentLinkRecord?.paymentLink
  // const paymentUrl = 'https://razorpay.com/payment-link/plink_Qoz7ihYPAxNcQY/test'

  // ✅ Access status from Redux store
  const currentStatus = useSelector((state) => state.payment.paymentDetails.status)

  // ✅ Periodically check payment status
  useEffect(() => {
    if (!contactIdFromURL) return

    const interval = setInterval(() => {
      dispatch(verifyStatusCode(contactIdFromURL))
    }, 4000) // check every 4 seconds

    return () => clearInterval(interval)
  }, [contactIdFromURL, dispatch])

  const handlePaymentClick = async () => {
    const match = paymentUrl.match(/plink_([a-zA-Z0-9]+)/)
    const paymentCode = match ? match[1] : null

    if (!paymentCode || !contactIdFromURL) {
      console.error('❌ Invalid Razorpay link or missing contactId')
      return
    }


    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const width = Math.min(800, screenWidth * 0.9)
    const height = Math.min(800, screenHeight * 0.9)
    const left = window.screenX + (screenWidth - width) / 2
    const top = window.screenY + (screenHeight - height) / 2

    const popup = window.open(
      paymentUrl,
      'RazorpayPopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no`
    )

    if (popup) {
      popup.focus()

      dispatch(sendStatusCode({
        contactId: contactIdFromURL,
        statusCode: paymentCode,
        email: 'pujarini@example.com'
      }))
        .unwrap()
        .then(() => {
          const closeInterval = setInterval(() => {
            if (popup.closed) {
              clearInterval(closeInterval)
              console.log('✅ Popup closed by user')
            } else {
              popup.close()
              clearInterval(closeInterval)
              console.log('✅ Popup auto-closed after status code dispatch')
            }
          }, 3000)
        })
        .catch((error) => {
          console.error('❌ Failed to send status code:', error)
        })
    } else {
      alert('Popup blocked! Please allow popups for this site.')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0fff4',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      {/* Customer Info */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #c6f6d5',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '600px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ color: '#2f855a', fontSize: '24px', marginBottom: '16px' }}>
          🧾 Customer Details
        </h2>
        <p><strong>Name:</strong> Pujarini Panda</p>
        <p><strong>Email:</strong> pujarini@example.com</p>
        <p><strong>Contact ID:</strong> CId-june-25-001</p>
        <p><strong>Amount:</strong> ₹3000</p>
<p><strong>Status:</strong> {
  currentStatus === 'completed' || currentStatus === 'unknown' ? '✅ Paid'
  : currentStatus === 'unpaid' ? '❌ Unpaid'
  : currentStatus === 'failed' ? '❌ Failed'
  : '⏳ Checking...'
}</p>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePaymentClick}
        style={{
          backgroundColor: '#38a169',
          color: '#fff',
          padding: '14px 28px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        ✅ Pay Now
      </button>
    </div>
  )
}

export default PaymentWithRedirect







