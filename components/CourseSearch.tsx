'use client'

import { useState } from 'react'
import { Database } from '@/types/database.types'
import useSWR from 'swr'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Course = Database['public']['Tables']['courses']['Row']

export default function CourseSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [section, setSection] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data, error, isLoading } = useSWR(
    debouncedQuery.length > 1 ? `/api/courses?q=${debouncedQuery}` : null,
    fetcher,
  )

  const courses = data?.courses || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const openDialog = (course: Course) => {
    setSelectedCourse(course)
    setIsDialogOpen(true)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search courses by code or title..."
          className="pl-10 w-full border-gray-300 focus:border-gray-500"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {/* Course List */}
      <div className="mt-4 space-y-3">
        {!isLoading &&
          courses.map((course: Course) => (
            <div key={course.id} onClick={() => openDialog(course)}>
              <Card className="hover:shadow-md">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">{course.code}</p>
                    <p className="font-medium">{course.title}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </CardContent>
              </Card>
            </div>
          ))}
      </div>

      {/* Error Handling */}
      {error && (
        <p className="mt-4 text-red-500 text-center">
          Oops, something went wrong. Please try again later.
        </p>
      )}

      {/* No Results */}
      {!isLoading && debouncedQuery.length > 1 && courses.length === 0 && (
        <p className="mt-4 text-gray-500 text-center">No courses found.</p>
      )}

      {/* Dialog (Popup for Section Input) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Enter Your Section</DialogTitle>
          {selectedCourse && (
            <p className="text-gray-600">
              {selectedCourse.code} - {selectedCourse.title}
            </p>
          )}
          <Input
            type="text"
            placeholder="Enter section (e.g., 002)"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
          <Button>Join Chat</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
