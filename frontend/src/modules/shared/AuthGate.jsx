'use client'

import { useAuthCheck } from '@/hooks/useAuthRedirect'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuthGate({ children }) {
  const { isLoading } = useAuthCheck()

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Skeleton className="w-1/2 h-32 rounded-xl" />
      </div>
    )
  }

  return <>{children}</>
}
