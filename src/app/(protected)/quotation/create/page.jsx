'use client';

import CreateQuotationForm from '@/components/modules/quotation/CreateQuotationForm';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateQuotationPage() {
  const searchParams = useSearchParams();
  const [meetingId, setMeetingId] = useState(null);
  const [contactId, setContactId] = useState(null);
// http://localhost:3000/quotation/create?meetingId=123&contactId=456
  useEffect(() => {
    setMeetingId(searchParams.get('meetingId'));
    setContactId(searchParams.get('contactId'));
  }, [searchParams]);

  return (
    <div className="">

      {meetingId && contactId ? (
        <>
     
          {/* Pass these IDs to a form component */}
          <CreateQuotationForm meetingId={meetingId} contactId={contactId} />
        </>
      ) : (
        <p className="text-red-500">Missing meetingId or contactId in URL</p>
      )}
    </div>
  );
}
