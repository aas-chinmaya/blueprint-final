'use client';

import  ClientDetails from '@/components/modules/clients/ClientDetails';

export default function Page({ params }) {
  return (
    
    <>
     
    <ClientDetails clientId={params.id} />
      
    
    </>
  );
}
