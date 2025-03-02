import { MessageCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

// Update interfaces to match Supabase's return format
interface Course {
  id: string;
  code: string;
  title: string;
}

interface CourseRoom {
  id: string;
  section: string;
  courses: Course; // Not an array, based on your data
}

export default async function MyCourses() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError || !user?.user) {
    return <p>You must be logged in to view courses.</p>
  }

  const userId = user.user.id

  // Get typed data from Supabase
  const { data: courseRooms, error } = await supabase
    .from('course_members')
    .select(`
      room_id,
      course_rooms (id, section, courses (id, code, title))
    `)
    .eq('user_id', userId)

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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {courseRooms.map((course) => {
          // Use type assertion to help TypeScript understand the structure
          const courseRoom = course.course_rooms as unknown as CourseRoom;
          const courseInfo = courseRoom.courses;
          
          return (
            <Link href={`/room/${course.room_id}`} key={course.room_id}>
              <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h2 className="font-medium">{courseInfo.code} - {courseRoom.section}</h2>
                <p className="text-sm text-gray-600 mt-1">{courseInfo.title}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
