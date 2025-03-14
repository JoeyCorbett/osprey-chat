"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"

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
          ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <LoginForm />
      </div>
    </div>
  )
}