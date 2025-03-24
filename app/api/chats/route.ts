import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { insertUserIntoRoom } from '@/utils/db'
import { chatJoinRateLimiter } from '@/lib/rateLimiter'
export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const { courseId, sectionId } = (await req.json()) as {
      courseId: string
      sectionId: string
    }

    if (!courseId || !sectionId) {
      return NextResponse.json({ error: 'Missing section id' }, { status: 400 })
    }

    // Get authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = userData.user.id

    const identifier =
      userData.user.id || req.headers.get('x-forwarded-for') || 'anonymous'

    const { success } = await chatJoinRateLimiter.limit(identifier)

    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 },
      )
    }

    // Check if user already joined more than 5 rooms
    const { count, error: countError } = await supabase
      .from('course_members')
      .select('user_id', { count: 'exact', head: true })
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
        { error: 'You are already in 5 rooms' },
        { status: 403 },
      )
    }

    // Verify section belongs to course
    const { data: sectionData, error: sectionError } = await supabase
      .from('sections')
      .select('id')
      .eq('id', sectionId)
      .eq('course_id', courseId)
      .single()

    if (sectionError) {
      console.error('Supabase error (Checking section):', sectionError.message)
      return NextResponse.json(
        { error: 'Database error when checking section' },
        { status: 500 },
      )
    }

    if (!sectionData) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    // Check if room exists
    const { data: roomData, error: roomError } = await supabase
      .from('course_rooms')
      .select('id')
      .eq('section_id', sectionId)
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
          .select('id')
          .eq('user_id', userId)
          .eq('room_id', roomData.id)
          .maybeSingle()

      if (existingMemberError) {
        console.error(
          'Supabase error (checking if user in in room)',
          existingMemberError.message,
        )
        return NextResponse.json({
          error: 'Error when checking membership',
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
    const { data: newRoomData, error: newRoomError } = await supabase
      .from('course_rooms')
      .insert({ section_id: sectionId })
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
