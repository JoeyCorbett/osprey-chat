'use client'

import { useState, useRef } from 'react'
import { Database } from '@/types/database.types'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import CourseCard from '@/components/CourseCard'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Course = Database['public']['Tables']['courses']['Row']

export default function CourseSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)

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
      <div className="flex items-center justify-center gap-2 mb-6">
        <Search className="w-6 h-6 text-gray-900" />
        <h1 className="text-2xl font-bold text-gray-900">Search for Courses</h1>
      </div>

      <div className="relative w-full mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={22}
        />
        <Input
          autoFocus
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search by code or title..."
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-12 py-3 text-base focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition shadow-sm"
        />
      </div>

      <div ref={containerRef} className="overflow-y-auto pr-2">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        <div className="space-y-3">
          {!isLoading &&
            courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-center">
            Oops, something went wrong. Please try again later.
          </p>
        )}

        {!isLoading && debouncedQuery.length > 1 && courses.length === 0 && (
          <p className="mt-4 text-gray-500 text-center">No courses found.</p>
        )}
      </div>
    </div>
  )
}
