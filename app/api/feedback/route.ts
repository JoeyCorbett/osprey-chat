import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { feedbackRateLimiter } from '@/lib/rateLimiter'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const identifier =
    userData.user.id || req.headers.get('x-forwarded-for') || 'anonymous'

  const { success } = await feedbackRateLimiter.limit(identifier)

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const { type, content } = await req.json()

  if (!type || !content) {
    return NextResponse.json(
      { error: 'Missing type or content' },
      { status: 400 },
    )
  }

  const { error: feedbackError } = await supabase.from('feedback').insert({
    type,
    content,
    user_id: userData.user.id,
  })

  if (feedbackError) {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 },
    )
  }

  return NextResponse.json(
    { message: 'Feedback submitted successfully' },
    { status: 200 },
  )
}
