import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const searchParams = req.nextUrl.searchParams
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
  }

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('id, section, instructor')
    .eq('course_id', courseId)

  if (sectionsError || !sections) {
    console.error('Error fetching sections:', sectionsError)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }

  return NextResponse.json(sections, { status: 200 })  
}