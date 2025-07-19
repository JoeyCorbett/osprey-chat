'use client'

import { useRouter } from 'next/navigation'

export function gotoSettings() {
  const router = useRouter()

  return async () => {
    router.push('/settings/profile')
  }
}
