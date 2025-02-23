import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import NavMenu from '@/components/NavMenu'
import MyCourses from '@/components/MyCourses'

export default async function Chats() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <>
      <NavMenu />
      <div className="mx-auto max-w-xl w-full px-4 mt-8">
        <div className="w-full">
          <MyCourses />
        </div>
      </div>
    </>
  )
}