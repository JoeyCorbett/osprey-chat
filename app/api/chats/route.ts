import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'
import { insertUserIntoRoom } from '@/utils/db'

type CourseRoomInsert = Database['public']['Tables']['course_rooms']['Insert']

export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const { course_id, section } = await req.json()

    if (!course_id || !section) {
      return NextResponse.json(
        { error: 'Missing course_id or section' },
        { status: 400 },
      )
    }

    // Check ceiling for section num
    const sectionNumber = parseInt(section, 10)
    if (isNaN(sectionNumber) || sectionNumber < 1 || sectionNumber > 50) {
      return NextResponse.json(
        { error: 'Section must be between 000 and 050' },
        { status: 400 },
      )
    }

    // Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json(
        { error: 'User must be logged in' },
        { status: 401 },
      )
    }
    const userId = userData.user.id

    // Check if user already joined more than 5 rooms
    const { count, error: countError } = await supabase
      .from('course_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError || count === null) {
      console.error('Supabase error (checking room count)')
      return NextResponse.json(
        { error: 'Database error when checking room count' },
        { status: 500 },
      )
    }

    if (count >= 5) {
      return NextResponse.json(
        { error: 'User is already in 5 rooms' },
        { status: 403 },
      )
    }

    // Get course ID
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('code', course_id)
      .single()

    if (courseError) {
      console.error('Supabase Error (fetching course)')
      return NextResponse.json(
        { error: 'Database error when fetching course' },
        { status: 500 },
      )
    }

    if (!courseData) {
      return NextResponse.json({ error: 'course not found' }, { status: 404 })
    }

    // Check if room exists
    const { data: roomData, error: roomError } = await supabase
      .from('course_rooms')
      .select('id')
      .eq('course_id', courseData.id)
      .eq('section', section)
      .maybeSingle()

    if (roomError) {
      console.error('Supabase error (Checking room):', roomError.message)
      return NextResponse.json(
        { error: 'Database error when checking room' },
        { status: 500 },
      )
    }

    // Room exists, add user
    if (roomData) {
      // Check if user is already in room
      const { data: existingMember, error: existingMemberError } =
        await supabase
          .from('course_members')
          .select('*')
          .eq('user_id', userId)
          .eq('room_id', roomData.id)
          .maybeSingle()

      if (existingMemberError) {
        console.error(
          'Supabase error (checking if user in in room)',
          existingMemberError.message,
        )
        return NextResponse.json({
          error: 'Database error when checking membership',
        })
      }

      if (existingMember) {
        return NextResponse.json(
          { message: 'User is already in the room', roomId: roomData.id },
          { status: 409 },
        )
      }

      const insertResult = await insertUserIntoRoom(userId, roomData.id)

      if (insertResult.error) {
        return NextResponse.json({ error: insertResult.error }, { status: 500 })
      }
      return NextResponse.json(
        {
          message: 'User successfully added to the room',
          roomId: roomData.id,
        },
        { status: 200 },
      )

      // Room doesn't exist, create room, then add
    }
    // Create new room
    const newRoom: CourseRoomInsert = {
      course_id: courseData.id,
      section: section,
    }

    const { data: newRoomData, error: newRoomError } = await supabase
      .from('course_rooms')
      .insert([newRoom])
      .select('id')
      .single()

    if (newRoomError) {
      console.error('Supabase error (inserting new room)', newRoomError)
      return NextResponse.json(
        { error: 'Failed to create new room' },
        { status: 500 },
      )
    }

    if (!newRoomData) {
      return NextResponse.json(
        { error: 'Failed to retrieve new room data' },
        { status: 500 },
      )
    }

    // Insert user into new room
    const insertResult = await insertUserIntoRoom(userId, newRoomData.id)
    if (insertResult.error) {
      return NextResponse.json({ error: insertResult.error }, { status: 500 })
    }
    return NextResponse.json({
      message: 'Room successfully created and user inserted',
      userId: userId,
      roomId: newRoomData.id,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
