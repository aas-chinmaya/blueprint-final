'use client'

import { useAuthCheck } from '@/hooks/useAuthRedirect'

export default function AuthGate({ children }) {
  const { isLoading } = useAuthCheck()

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
