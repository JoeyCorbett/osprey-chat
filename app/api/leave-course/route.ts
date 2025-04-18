import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { messageRateLimiter } from '@/lib/rateLimiter'

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { roomId } = await req.json()

  if (!roomId) {
    return NextResponse.json({ error: 'Missing room ID' }, { status: 400 })
  }

  // Get authenticated user
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const identifier =
    user?.user.id || req.headers.get('x-forwarded-for') || 'anonymous'

  const { success } = await messageRateLimiter.limit(identifier)

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // Remove user from course_members table
  const { error } = await supabase
    .from('course_members')
    .delete()
    .eq('user_id', user.user.id)
    .eq('room_id', roomId)

  if (error) {
    console.error('Leave Course Error:', error)
    return NextResponse.json(
      { error: 'Failed to leave course' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
