import { LoginForm } from '@/components/login-form'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-muted p-6 md:p-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <LoginForm />
        </div>
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
