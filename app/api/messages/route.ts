import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const searchParams = req.nextUrl.searchParams
  const roomId = searchParams.get('roomId')
  const cursor = searchParams.get('cursor')
  const limit = 35

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data: membership, error: membershipError } = await supabase
    .from('course_members')
    .select('*')
    .eq('user_id', user.user.id)
    .eq('room_id', roomId)
    .single()

  if (membershipError || !membership) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  let query = supabase
    .from('messages')
    .select('id, content, created_at, user_id, profiles(username, avatar_url)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) {
    try {
      const normalizedCursor = cursor.split(".")[0] + "Z";
      const cursorDate = new Date(normalizedCursor);
      if (isNaN(cursorDate.getTime())) {
        throw new Error('Invalid cursor timestamp')
      }
      query = query.lt('created_at', cursorDate.toISOString())
    } catch (error) {
      console.error('Invalid cursor format:', cursor, error)
      return NextResponse.json(
        { error: 'Invalid cursor format' },
        { status: 400 }
      )
    }
  }

  const { data: messages, error } = await query

  const reverseMessages = messages ? [...messages].reverse() : []
  
  if (error) {
    console.error('Error fetching messages', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 },
    )
  }

  const hasMore = messages.length === limit
  const nextCursor = hasMore ? reverseMessages[0].created_at : null

  return NextResponse.json({
    messages: reverseMessages,
    hasMore,
    nextCursor
  }, { status: 200 })
}

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { roomId, content } = await req.json()

  const { data: membership, error: membershipError } = await supabase
    .from('course_members')
    .select('*')
    .eq('user_id', user.user.id)
    .eq('room_id', roomId)
    .single()

  if (membershipError || !membership) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      content,
      room_id: roomId,
      user_id: user.user.id,
    })
    .select('id, content, created_at, user_id')
    .single()

  if (messageError) {
    console.error('Error sending message', messageError)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 },
    )
  }

  return NextResponse.json(message, { status: 201 })
}
