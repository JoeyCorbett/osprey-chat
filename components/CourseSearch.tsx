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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Course = Database['public']['Tables']['courses']['Row']

export default function CourseSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [section, setSection] = useState('')

  const { data, error, isLoading } = useSWR(
    debouncedQuery.length > 1 ? `/api/courses?q=${debouncedQuery}` : null,
    fetcher,
  )

  const courses = data?.courses || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-center gap-2 mb-10">
        <Search className="w-6 h-6 text-gray-900" />
        <h1 className="text-2xl font-bold text-gray-900">Search for Courses</h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={22}
        />
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search by code or title..."
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-12 py-3 text-base focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition shadow-sm"
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
            <Dialog key={course.id}>
              <DialogTrigger asChild>
                <div>
                  <Card className='hover:shadow-md cursor-pointer'>
                    <CardContent className='p-4 flex justify-between items-center'>
                      <div>
                        <p className='text-sm text-gray-600'>{course.code}</p>
                        <p className='font-medium'>{course.title}</p>
                      </div>
                      <ChevronRight className='text-gray-400' size={20} />
                    </CardContent>
                  </Card>
                </div>
              </DialogTrigger>
              <DialogContent className='sm:top-1/2 top-[30%] transform -translate-y-1/2'>
                <DialogTitle>Enter Your Section</DialogTitle>
                <p className='text-gray-600'>
                  {course.code} - {course.title}
                </p>
                <Input
                  type='text'
                  placeholder='Enter section (e.g., 002)'
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
                <Button>Join Chat</Button>
              </DialogContent>
            </Dialog>
          ))
          }
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
    </div>
  )
}
