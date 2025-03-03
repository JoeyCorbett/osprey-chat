'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CourseActions from '@/components/CourseActions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Course {
  id: string
  code: string
  title: string
}

interface CourseRoom {
  id: string
  section: string
  courses: Course
}

interface Courses {
  room_id: string
  course_rooms: {
    id: string
    section: string
    courses: {
      id: string
      code: string
      title: string
    }[]
  }[]
}

interface CourseListProps {
  initialCourses: Courses[]
}

export default function CourseList({ initialCourses }: CourseListProps) {
  const [courses, setCourses] = useState(initialCourses)
  const router = useRouter()

  const onLeave = (roomId: string) => {
    const prevCourses = courses
    setCourses(courses.filter((course) => course.room_id !== roomId))

    return () => setCourses(prevCourses)
  }

  if (courses.length === 0) {
    return (
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
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {courses.map((course) => {
        const courseRoom = course.course_rooms as unknown as CourseRoom
        const courseInfo = courseRoom.courses

        return (
          <div
            key={course.room_id}
            className="relative flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <Link href={`/room/${course.room_id}`} className="flex-1">
              <div className="flex flex-col">
                <h2 className="font-semibold text-gray-900 text-lg">
                  {courseInfo.code} - {courseRoom.section}
                </h2>
                <p className="text-sm text-gray-600">{courseInfo.title}</p>
              </div>
            </Link>

            <CourseActions roomId={course.room_id} onLeave={onLeave} />
          </div>
        )
      })}
    </div>
  )
}
