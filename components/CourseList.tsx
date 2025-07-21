'use client'

import CourseActions from '@/components/CourseActions'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface Courses {
  id: string
  code: string
  title: string
}

interface Sections {
  id: string
  course_id: string
  section: string
  instructor: string
  courses: Courses
}

interface CourseRooms {
  id: string
  section_id: string
  sections: Sections
}

interface CourseList {
  room_id: string
  course_rooms: CourseRooms
}

interface CourseListProps {
  initialCourses: CourseList[]
}

export default function CourseList({ initialCourses }: CourseListProps) {
  function formatSection(section: string) {
    return section.toString().padStart(3, '0')
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {initialCourses.map((course) => {
        const courseRoom = course.course_rooms as unknown as CourseRooms
        const section = courseRoom.sections
        const courseInfo = section.courses

        return (
          <Card
            key={course.room_id}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-secondary text-secondary-foreground font-medium rounded-[var(--radius)] px-2 py-1 text-sm">
                    {courseInfo.code}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Section {formatSection(section.section)}
                  </span>
                </div>
                <CourseActions roomId={course.room_id} />
              </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-semibold text-card-foreground text-lg line-clamp-2">
                      {courseInfo.title}
                    </h2>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 sm:mt-0">
                      <span className="inline-flex items-center max-w-[200px] sm:max-w-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 flex-shrink-0">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="truncate" title={section.instructor}>
                          {section.instructor}
                        </span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4">
                    <Link 
                      href={`/room/${course.room_id}`}
                      className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-[var(--radius)] hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Join Chat
                    </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
