'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateQuotationPage() {
  const searchParams = useSearchParams();
  const [meetingId, setMeetingId] = useState(null);
  const [contactId, setContactId] = useState(null);

  useEffect(() => {
    setMeetingId(searchParams.get('meetingId'));
    setContactId(searchParams.get('contactId'));
  }, [searchParams]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Quotation</h1>

      {meetingId && contactId ? (
        <>
          <p>✅ Meeting ID: {meetingId}</p>
          <p>✅ Contact ID: {contactId}</p>
          {/* Pass these IDs to a form component */}
        </>
      ) : (
        <p className="text-red-500">Missing meetingId or contactId in URL</p>
      )}
    </div>
  );
}
