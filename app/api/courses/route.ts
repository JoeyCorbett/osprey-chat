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
  
  // Normalize whitespace (replace multiple spaces with single space)
  const cleanQuery = normalizedQuery.replace(/\s+/g, ' ')

  // Split the normalized query into a prefix and number
  const prefix = cleanQuery.match(/[a-zA-Z]+/)?.[0] || ''
  const number = cleanQuery.match(/\d+/)?.[0] || ''

  // For title search, split into words and create a flexible pattern
  // This will match titles where words appear in sequence with any amount of whitespace between them
  const words = cleanQuery.split(' ').filter(word => word.length > 0)
  const titlePattern = words.length > 0 
    ? words.map(word => `%${word}%`).join('') 
    : `%${cleanQuery}%`

  // Search for courses with the prefix and number or title
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .or(`code.ilike.${prefix}%${number}%, title.ilike.${titlePattern}`)
    .limit(15)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ courses: data }, { status: 200 })
}
