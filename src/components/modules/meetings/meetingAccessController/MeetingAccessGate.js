







'use client'

import { useState } from 'react'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import { sendPaymentlink } from '@/store/features/meeting/paymentSlice'

function MeetingAccessGate({ contactId, contactEmail = 'it_chinmaya@outlook.com', onCancel }) {
  const [isSending, setIsSending] = useState(false)
  const dispatch = useDispatch()

  const handleSendLink = async () => {
    if (!contactId || !contactEmail) {
      toast.error('❌ Missing contact ID or email')
      return
    }

    setIsSending(true)

    const payload = {
      amount: 1000,
      contactId,
      email: contactEmail,
    }

    try {
      await dispatch(sendPaymentlink(payload)).unwrap()
      toast.success('✅ Payment link sent successfully. Please complete the payment to schedule more meetings.')
    } catch (error) {
      console.error('[MeetingAccessGate] Error:', error)
      toast.error('❌ Failed to send payment link')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        onClick={onCancel}
        className="border-gray-300 text-gray-700"
        disabled={isSending}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSendLink}
        className="bg-blue-600 text-white hover:bg-blue-700"
        disabled={isSending}
      >
        {isSending ? 'Sending...' : 'Send Payment Link'}
      </Button>
    </div>
  )
}

export default MeetingAccessGate