import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Get authenticated user
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all users in the room
  const { data: roomMembers, error: membersError } = await supabase
    .from('course_members')
    .select('user_id, profiles:user_id(id, username, avatar_url)')
    .eq('room_id', roomId)

  if (membersError) {
    console.error('Error fetching room members:', membersError)
    return NextResponse.json(
      { error: 'Failed to fetch room members' },
      { status: 500 }
    )
  }

  return NextResponse.json(roomMembers)
} 