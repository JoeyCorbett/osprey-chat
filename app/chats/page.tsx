import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import CourseSearch from '@/components/CourseSearch'

export default async function Chats() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className='max-w-2x1 mx-auto p-4'>
      <h1 className='text-x1 font-bold-mb-4'>Search for Courses</h1>
      <CourseSearch />
    </div>
  )
}