import ChatRoomClient from '@/components/ChatRoomClient'
import MessageInput from '@/components/MessageInput'
import RoomUsersPopover from '@/components/RoomUsersPopover'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { toast } from 'sonner'
import { PostgrestError } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

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

  // Check if user is authenticated
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    redirect('/login')
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
    toast.error('There was an error fetching course info')
    redirect('/chats')
  }

  const baseFormat = `${room.sections.courses.code} - ${room.sections.section}`
  const desktopFormat = `${baseFormat} | ${room.sections.courses.title}`
  const mobileFormat = baseFormat

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

        <h1 className="text-base sm:text-lg font-semibold truncate max-w-[60%]">
          <span className="hidden md:inline">{desktopFormat}</span>
          <span className="md:hidden">{mobileFormat}</span>
        </h1>

        <RoomUsersPopover roomId={room_id} />
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="h-full">
          <ChatRoomClient roomId={room_id} user_id={user.user.id} />
        </div>
      </main>

      <footer className="p-3 sm:p-4 border-t bg-white sticky bottom-0 z-10">
        <MessageInput roomId={room_id} />
      </footer>
    </div>
  )
}
