'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton({ isMobile = false }) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <>
      {isMobile ? (
        <Button variant="outline" onClick={handleLogout}>
          <LogOut />
          Sign out
        </Button>
      ) : (
        <span onClick={handleLogout}>Sign out</span>
      )}
    </>
  )
}
