import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { parse } from 'url'

export async function GET(req: Request) {
  const supabase = await createClient()

  const { query } = parse(req.url!, true)
  const roomId = query.roomId as string

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

  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, content, created_at, user_id')
    .eq('room_id', roomId)
    .limit(100)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 },
    )
  }

  return NextResponse.json(messages)
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
  
  if (membershipError || !membership ) {
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
