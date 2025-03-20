import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError || !user?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: courseRooms, error } = await supabase
    .from('course_members')
    .select(
      `
      room_id,
      course_rooms (
        id, section_id,
        sections (
          id, course_id, section, instructor,
          courses (
            id, code, title
          )
        )
      )
    `,
    )
    .eq('user_id', user.user.id)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to load courses' },
      { status: 500 },
    )
  }

  return NextResponse.json(courseRooms)
}
