'use client';

import CreateQuotationForm from '@/modules/quotation/CreateQuotationForm';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuotationPageContent() {
  const searchParams = useSearchParams();
  const [meetingId, setMeetingId] = useState(null);
  const [contactId, setContactId] = useState(null);

  useEffect(() => {
    setMeetingId(searchParams.get('meetingId'));
    setContactId(searchParams.get('contactId'));
  }, [searchParams]);

  return (
    <div className="">
      {meetingId && contactId ? (
        <CreateQuotationForm meetingId={meetingId} contactId={contactId} />
      ) : (
        <p className="text-red-500">Missing meetingId or contactId in URL</p>
      )}
    </div>
  );
}
