'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function PaymentStatusPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const router = useRouter()

  const renderStatus = () => {
    if (status === 'paid') {
      return (
        <>
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-semibold text-green-600">Payment Successful</h2>
        </>
      )
    } else if (status === 'failed') {
      return (
        <>
          <XCircle className="w-16 h-16 text-red-500" />
          <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
        </>
      )
    } else {
      return (
        <>
          <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
          <h2 className="text-2xl font-semibold text-yellow-600">Payment Pending</h2>
        </>
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-white"
    >
      <div className="flex flex-col items-center space-y-4">
        {renderStatus()}
        <Button onClick={() => router.push('/payment')}>Back to Payment</Button>
      </div>
    </motion.div>
  )
}
