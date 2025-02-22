'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CourseSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

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
          courses.map((course: any) => (
            <div key={course.id}>
              <Card className="hover:shadow-md">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">{course.code}</p>
                  <p className="font-medium">{course.title}</p>
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
    </div>
  )
}
