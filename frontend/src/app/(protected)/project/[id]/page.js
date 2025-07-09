





'use client';

import { use } from 'react';
import ViewProjectById from '@/modules/project/ViewProjectById';

export default function Page({ params }) {
  const resolvedParams = use(params); // Unwrap the params Promise
  return (
    <>
      <div className="px-4 lg:px-6">
        <ViewProjectById projectId={resolvedParams.id} />
      </div>
    </>
  );
}