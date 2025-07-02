'use client';

import UpdateClient from '@/components/modules/clients/UpdateClient';

export default function EditPage({ params }) {
  return (
      <>
       
          <UpdateClient clientId={params.id} />
          
        
        </>
  );
}
