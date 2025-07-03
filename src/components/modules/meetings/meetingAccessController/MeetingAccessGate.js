





// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// function MeetingAccessGate({ onPaymentSuccess, onCancel }) {
//   const [paymentLink, setPaymentLink] = useState('');

//   const handlePayment = () => {
//     // Here you would typically integrate with a payment gateway
//     // For demo purposes, we'll simulate a successful payment
//     if (paymentLink) {
//       onPaymentSuccess();
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <Label htmlFor="paymentLink" className="text-green-800">
//           Payment Link
//         </Label>
//         <Input
//           id="paymentLink"
//           value={paymentLink}
//           onChange={(e) => setPaymentLink(e.target.value)}
//           placeholder="Enter payment link or transaction ID"
//           className="border-green-300 focus:ring-green-500 text-green-900"
//         />
//       </div>
//       <div className="flex justify-end space-x-2">
//         <Button
//           variant="outline"
//           onClick={onCancel}
//           className="border-green-300 text-green-700 hover:bg-green-50"
//         >
//           Cancel
//         </Button>
//         <Button
//           className="bg-green-700 hover:bg-green-800 text-white"
//           onClick={handlePayment}
//           disabled={!paymentLink}
//         >
//           Submit Payment
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default MeetingAccessGate;










import { toast } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosInstance';

function MeetingAccessGate({ onPaymentSuccess, onCancel }) {
  const [paymentLink, setPaymentLink] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Hypothetical API endpoint
  // const PAYMENT_API_URL = axiosInstance;

  // API call to send payment link
  const sendPaymentLink = async (link) => {
    console.log('[MeetingAccessGate] Sending payment link:', link);
    try {
      const response = await axiosInstance.post(PAYMENT_API_URL, {
        paymentLink: link,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer DUMMY_API_KEY' // Placeholder auth
        }
      });
      console.log('[MeetingAccessGate] API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[MeetingAccessGate] Error sending payment link:', error);
      // Simulate response for testing
      return {
        status: 'success',
        message: 'Payment link sent successfully'
      };
    }
  };

  // Handle payment link submission
  const handleSendLink = async () => {
    console.log('[MeetingAccessGate] handleSendLink called with paymentLink:', paymentLink);
    
    setIsSending(true);

    const response = await sendPaymentLink(paymentLink);
    
    if (response.status === 'success') {
      console.log('[MeetingAccessGate] Payment link sent successfully');
      toast.success(response.message);
      onPaymentSuccess();
    } else {
      console.log('[MeetingAccessGate] Failed to send payment link:', response.message);
      toast.error(response.message || 'Failed to send payment link');
    }

    setIsSending(false);
  };

  // Log component mount
  useEffect(() => {
    console.log('[MeetingAccessGate] Component mounted');
    return () => {
      console.log('[MeetingAccessGate] Component unmounted');
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="paymentLink" className="text-green-800">
          Payment Link
        </Label>
        <Input
          id="paymentLink"
          value={paymentLink}
          onChange={(e) => {
            console.log('[MeetingAccessGate] Payment link input changed:', e.target.value);
            setPaymentLink(e.target.value);
          }}
          placeholder="Enter payment link or transaction ID"
          className="border-green-300 focus:ring-green-500 text-green-900"
          disabled={isSending}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            console.log('[MeetingAccessGate] Cancel button clicked');
            onCancel();
          }}
          className="border-green-300 text-green-700 hover:bg-green-50"
          disabled={isSending}
        >
          Cancel
        </Button>
        {paymentLink && (
          <Button
            className="bg-green-700 hover:bg-green-800 text-white"
            onClick={handleSendLink}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send Link'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingAccessGate;