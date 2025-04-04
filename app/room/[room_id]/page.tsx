import RoomUsersPopover from '@/components/RoomUsersPopover'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import ChatPage from '@/components/ChatPage'

interface Course {
  id: string
  code: string
  title: string
}

interface Section {
  id: string
  course_id: string
  section: string
  instructor: string
  courses: Course
}

interface Room {
  id: string
  section_id: string
  sections: Section
}
export default async function RoomPage({
  params,
}: {
  params: Promise<{ room_id: string }>
}) {
  const supabase = await createClient()
  const { room_id } = await params

  const { data: user } = await supabase.auth.getUser()

  if (!user?.user) {
    redirect('/')
  }

  const userData = {
    id: user.user.id,
    username: user.user.user_metadata?.name,
    avatar_url: user.user.user_metadata?.avatar_url,
  }

  if (!userData.username || !userData.avatar_url || !userData.id) {
    console.error('User data is missing')
    redirect('/chats')
  }

  const { data: room, error } = (await supabase
    .from('course_rooms')
    .select(
      'id, section_id, sections (id, course_id, section, instructor, courses (id, code, title))',
    )
    .eq('id', room_id)
    .single()) as { data: Room | null; error: PostgrestError | null }

  if (error || !room) {
    console.error('Error fetching room', error)
    redirect('/chats')
  }

  return (
    <div className="flex flex-col h-dvh">
      <header className="p-3 sm:p-4 flex items-center justify-between border-b bg-white sticky top-0 z-10 shadow-sm">
        <Link
          href="/chats"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back to chats"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>

        <div className="flex flex-col items-center max-w-[60%] overflow-hidden">
          <h1 className="text-base sm:text-lg font-semibold truncate w-full text-center">
            {room.sections.courses.code} -{' '}
            {room.sections.section.toString().padStart(3, '0')}
          </h1>
          <div className="text-xs text-gray-500 truncate w-full text-center hidden md:block">
            <span className="font-medium">{room.sections.courses.title}</span>
            <span className="mx-1">•</span>
            <span>{room.sections.instructor}</span>
          </div>
        </div>

        <RoomUsersPopover roomId={room_id} />
      </header>

      <div className="flex-1 overflow-y-auto">
        <ChatPage roomId={room_id} user={userData} />
      </div>
    </div>
  )
}
