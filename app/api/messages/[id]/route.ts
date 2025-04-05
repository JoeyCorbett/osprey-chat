import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!id) {
    return NextResponse.json(
      { error: 'Message ID is required' },
      { status: 400 },
    )
  }
  const supabase = await createClient()

  // Auth Check
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Fetch message (user_id, file_url) 
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .select('user_id, file_url')
    .eq('id', id)
    .single()

  if (messageError || !message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  // Ownership Check
  if (message.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  if (message.file_url) {
    console.log('message.file_url', message.file_url)
    const storagePath = message.file_url.split('/object/public/uploads/')[1]
    console.log('storagePath', storagePath)
    if (storagePath) {
      await supabase.storage.from('uploads').remove([storagePath])
    }
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
