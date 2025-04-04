'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useLogout } from '@/hooks/useLogout'

export default function LogoutButton({ isMobile = false }) {
  const logout = useLogout()

  return isMobile ? (
    <Button variant="outline" onClick={logout}>
      <LogOut />
      Sign out
    </Button>
  ) : (
    <p>test</p>
  )
}
