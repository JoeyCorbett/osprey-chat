'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function useLogout() {
  const router = useRouter()
  const supabase = createClient()

  return async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }
}
