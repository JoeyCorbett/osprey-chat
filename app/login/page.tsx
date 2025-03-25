'use client'

import { useState, useEffect } from 'react'
import { LoginForm } from '@/components/login-form'
import Link from 'next/link'
export default function LoginPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div
        className={`
          flex w-full max-w-sm flex-col gap-6
          transition-all duration-500 ease-out
          ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <LoginForm />
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-center text-gray-500">
          By logging in, you agree to the{' '}
          <Link href="/terms" className="text-blue-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-500">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
