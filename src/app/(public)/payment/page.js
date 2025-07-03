
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

const PaymentComponent = () => {
  const router = useRouter()

  const [status, setStatus] = useState('idle')
  const [countdown, setCountdown] = useState(5)
  const [statusCode, setStatusCode] = useState('')

  const [paymentDetails, setPaymentDetails] = useState({
    contactId: 'cont_demo123',
    meetingId: 'meet_demo456',
    email: 'demo.user@example.com',
    statusCode: ''
  })

  const qrRef = useRef(null)
  const cardRef = useRef(null)
  const containerRef = useRef(null)
  const successRef = useRef(null)

  // Animate on mount
  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(containerRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 })
      .fromTo(qrRef.current, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.4')
      .fromTo(cardRef.current, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.6')
    return () => tl.kill()
  }, [])

  useEffect(() => {
    let timer
    if (status === 'success') {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push(`/payment/status?status=success`)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [status, router])

  const sendPaymentConfirmation = async (payload) => {
    console.log('📦 Payload to backend:', payload)

    // Force fake successful backend response
    setTimeout(() => {
      console.log('✅ Simulated backend success!')
    }, 500)

    return true
  }

  const handlePay = async () => {
    setStatus('processing')

    const generatedStatusCode = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('')
    setStatusCode(generatedStatusCode)

    const finalPayload = {
      ...paymentDetails,
      statusCode: generatedStatusCode,
      status: 'completed'
    }

    gsap.to(cardRef.current, {
      scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: async () => {
        await sendPaymentConfirmation(finalPayload)
        setPaymentDetails(prev => ({ ...prev, statusCode: generatedStatusCode }))
        setStatus('success')

        gsap.to(successRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        })

        gsap.to(cardRef.current, {
          scale: 1,
          backgroundColor: '#ecfdf5',
          duration: 0.6
        })
      }
    })
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10 border rounded-2xl shadow-md p-6 bg-white"
    >
      {/* Left: QR Placeholder */}
      <div ref={qrRef} className="flex items-center justify-center">
        <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
          QR CODE
        </div>
      </div>

      {/* Right: Payment Details + Button */}
      <div ref={cardRef} className="space-y-4 transition-all">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Contact ID:</strong> {paymentDetails.contactId}</p>
          <p><strong>Meeting ID:</strong> {paymentDetails.meetingId}</p>
          <p><strong>Email:</strong> {paymentDetails.email}</p>
        </div>

        <Button
          onClick={handlePay}
          disabled={status === 'processing' || status === 'success'}
          className="w-full"
        >
          {status === 'processing' ? 'Processing...' : 'Pay ₹299'}
        </Button>

        {status === 'success' && (
          <div
            ref={successRef}
            className="flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-xl mt-4"
          >
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Payment Successful!</p>
              <p className="text-sm">Status Code: <strong>{statusCode}</strong></p>
              <p className="text-xs text-gray-600">Redirecting in {countdown}s...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentComponent


