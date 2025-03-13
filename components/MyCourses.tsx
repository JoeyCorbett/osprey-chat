import { MessageCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import CourseList from '@/components/CourseList'

export default async function MyCourses() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError || !user?.user) {
    return <p>You must be logged in to view courses.</p>
  }

  const { data: courseRooms, error } = await supabase
    .from('course_members')
    .select(
      `
      room_id,
      course_rooms (id, section, courses (id, code, title))
    `,
    )
    .eq('user_id', user.user.id)

  if (error || courseRooms === null) {
    console.error('Error fetching courses', error)
    return <p>Failed to load courses.</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-center gap-2 mb-10">
        <MessageCircle className="w-6 h-6 text-gray-900" />
        <h1 className="text-2xl font-bold text-gray-900">Course Chats</h1>
      </div>
      <CourseList initialCourses={courseRooms} />
    </div>
  )
}
