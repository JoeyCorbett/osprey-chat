'use client'

import useSWR from 'swr'
import { MessageCircle } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import CourseList from '@/components/CourseList'

const fetcher = async () => {
  const res = await fetch('/api/my-courses')
  if (!res.ok) throw new Error('Failed to load courses')
  return res.json()
}

export default function MyCourses() {
  const { data: courseRooms, error } = useSWR('/api/my-courses', fetcher)
  const router = useRouter()

  if (!courseRooms) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center gap-2 mb-10">
          <MessageCircle className="w-6 h-6 text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">Course Chats</h1>
        </div>

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 w-full rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-center gap-2 mb-10">
        <MessageCircle className="w-6 h-6 text-gray-900" />
        <h1 className="text-2xl font-bold text-gray-900">Course Chats</h1>
      </div>

      {error && (
        <p className="text-red-500 text-center">Failed to load courses.</p>
      )}

      {courseRooms && courseRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            You&apos;re not in any courses yet
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Join a course to start participating in discussions and accessing
            resources.
          </p>
          <Button className="m-4" onClick={() => router.push('/search')}>
            Find Courses
          </Button>
        </div>
      ) : (
        <CourseList initialCourses={courseRooms} />
      )}
    </div>
  )
}
