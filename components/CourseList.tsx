'use client'

import CourseActions from '@/components/CourseActions'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

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
  return (
    <div className="mt-6 flex flex-col gap-4">
      {initialCourses.map((course) => {
        const courseRoom = course.course_rooms as unknown as CourseRoom
        const courseInfo = courseRoom.courses

        return (
          <Card key={course.room_id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="flex items-center justify-between p-4">
              <Link href={`/room/${course.room_id}`} className="flex-1">
                <div className="flex flex-col">
                  <h2 className="font-semibold text-gray-900 text-lg">
                    {courseInfo.code} - {courseRoom.section}
                  </h2>
                  <p className="text-sm text-gray-600">{courseInfo.title}</p>
                </div>
              </Link>

              <CourseActions roomId={course.room_id} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
