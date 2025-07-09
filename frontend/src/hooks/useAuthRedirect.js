'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '@/store/features/shared/authSlice'

export const useAuthCheck = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { isAuthenticated, isTokenChecked } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap()
      } catch (error) {
        // Optional: silent
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [dispatch])

  useEffect(() => {
    if (isTokenChecked && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isTokenChecked, isAuthenticated, router])

  return { isAuthenticated, isTokenChecked, isLoading }
}
