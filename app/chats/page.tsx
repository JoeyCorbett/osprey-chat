import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CourseSearch from '@/components/CourseSearch'
import NavMenu from '@/components/NavMenu'

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
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-4">
          Search for Courses
        </h1>
        <div className="w-full">
          <CourseSearch />
        </div>
      </div>
    </>
  )
}