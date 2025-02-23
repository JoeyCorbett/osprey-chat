import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CourseSearch from '@/components/CourseSearch'
import NavMenu from '@/components/NavMenu'

export default async function Search() {
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
          <CourseSearch />
        </div>
      </div>
    </>
  )
}