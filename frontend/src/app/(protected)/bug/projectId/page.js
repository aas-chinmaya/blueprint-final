// 'use client'

// import ProjectBugs from '@/modules/bug/ProjectBugs'
// import { useSearchParams } from 'next/navigation'

// export default function ProjectBugListPage() {
//   const searchParams = useSearchParams()
//   const projectId = searchParams.get('projectId')


//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-4">🪲 Bugs for Project ID: {projectId}</h1>
//       <ProjectBugs projectId={projectId} />
//     </div>
//   )
// }



// src/app/(protected)/bug/projectId/page.js
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectBugs from "@/modules/bug/ProjectBugs";

// Component to handle search params within Suspense
function ProjectBugListContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        🪲 Bugs for Project ID: {projectId || "N/A"}
      </h1>
      <ProjectBugs projectId={projectId} />
    </div>
  );
}

export default function ProjectBugListPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-full bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <ProjectBugListContent />
    </Suspense>
  );
}