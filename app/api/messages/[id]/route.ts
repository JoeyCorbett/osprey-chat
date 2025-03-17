import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json(
      { error: 'Message ID is required' },
      { status: 400 },
    )
  }
  const supabase = await createClient()

  // get user
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // check if user is the owner of the message
  const { data: userId, error: userIdError } = await supabase
    .from('messages')
    .select('user_id')
    .eq('id', id)
    .single()

  if (userIdError || !userId) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  if (userId?.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // delete message
  const { error: deleteError } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: 'Message deleted' }, { status: 200 })
}
