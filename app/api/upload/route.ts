import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { fileUploadRateLimiter } from '@/lib/rateLimiter'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Get user
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError || !user?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate Limit
  const identifier =
    user?.user.id || req.headers.get('x-forwarded-for') || 'anonymous'

  const { success } = await fileUploadRateLimiter.limit(identifier)

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const userId = user?.user?.id
  // Parse Form Data
  const formData = await req.formData()
  const file = formData.get('file') as File
  const fileName = formData.get('originalFileName') as string
  const chatRoomId = formData.get('chatRoomId') as string
  const messageId = formData.get('messageId') as string

  if (!file || !fileName || !chatRoomId || !messageId) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'File size must be less than 10MB' },
      { status: 400 },
    )
  }

  // Build Path chat-files/{chatRoomId}/{messageId}-{userId}.{ext}
  const ext = file.name.split('.').pop()
  const path = `chat-files/${chatRoomId}/${messageId}-${userId}.${ext}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(path, file)

  if (uploadError) {
    console.error('Upload error', uploadError)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 },
    )
  }

  const { error: messageUpdateError } = await supabase
    .from('messages')
    .update({
      file_url: uploadData.path,
      file_name: fileName,
      file_type: file.type,
    })
    .eq('id', messageId)

  if (messageUpdateError) {
    console.error('Message update error', messageUpdateError)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: 200 })
}
