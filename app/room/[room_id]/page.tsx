import ChatRoomClient from '@/components/ChatRoomClient'
import MessageInput from '@/components/MessageInput'
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

interface Room {
  id: string
  course_id: string
  section: string
  courses: Course
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{room_id: string}>
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
    .select('course_id, section, courses (id, code, title)')
    .eq('id', room_id)
    .single()) as { data: Room | null; error: PostgrestError | null }

  if (error || !room) {
    console.error('Error fetching room', error)
    toast.error('There was an error fetching course info')
    redirect('/chats')
  }

  const baseFormat = `${room.courses.code} - ${room.section}`
  const desktopFormat = `${baseFormat} | ${room.courses.title}`
  const mobileFormat = baseFormat

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 flex items-center gap-2 border-b bg-white">
        <Link
          href="/chats"
          className="hover:bg-gray-100 p-1 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">
          <span className="hidden md:inline">{desktopFormat}</span>
          <span className="md:hidden">{mobileFormat}</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <ChatRoomClient roomId={room_id} user_id={user.user.id}/>
      </main>

      <footer className="p-4 border-t bg-white">
        <MessageInput roomId={room_id} />
      </footer>
    </div>
  )
}
