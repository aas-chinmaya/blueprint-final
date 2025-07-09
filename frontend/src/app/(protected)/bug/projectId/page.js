'use client'

import ProjectBugs from '@/modules/bug/ProjectBugs'
import { useSearchParams } from 'next/navigation'

export default function ProjectBugListPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  if (!projectId) {
    return (
      <div className="text-center text-red-600 py-10">
        ❌ Missing projectId in the URL.
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">🪲 Bugs for Project ID: {projectId}</h1>
      <ProjectBugs projectId={projectId} />
    </div>
  )
}
