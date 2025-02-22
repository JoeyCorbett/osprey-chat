import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ courses: [] })
  }

  const { data, error} = await supabase
    .from('courses')
    .select('*')
    .or(`code.ilike.%${query}%, title.ilike.%${query}%`)
    .limit(15)


    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ courses: data})
}
