import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ courses: [] })
  }

  // Remove non-alphanumeric chars from query (mainly used to filter out dashes)
  const normalizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, '').trim()

  // Split the normalized query into a prefix and number
  const prefix = normalizedQuery.match(/[a-zA-Z]+/)?.[0] || ''
  const number = normalizedQuery.match(/\d+/)?.[0] || ''

  // TODO: Filter out course section OR add support for it

  // Search for courses with the prefix and number or title
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .or(`code.ilike.${prefix}%${number}%,title.ilike.%${normalizedQuery}%`)
    .limit(15)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ courses: data})
}
