import { Metadata } from 'next'
import CourseSearch from '@/components/CourseSearch'

export const metadata: Metadata = {
  title: 'Search',
}

export default async function Search() {
  return (
    <>
      <div className="mx-auto max-w-xl w-full px-4 mt-8">
        <div className="w-full">
          <CourseSearch />
        </div>
      </div>
    </>
  )
}
