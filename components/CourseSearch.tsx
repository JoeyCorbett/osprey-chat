'use client'

import { useState, useEffect, useRef } from 'react'
import { Database } from '@/types/database.types'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Search, ArrowUp } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import CourseCard from '@/components/CourseCard'
import { Button } from '@/components/ui/button'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Course = Database['public']['Tables']['courses']['Row']

export default function CourseSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [section, setSection] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, error, isLoading } = useSWR(
    debouncedQuery.length > 1 ? `/api/courses?q=${debouncedQuery}` : null,
    fetcher,
  )

  const courses = data?.courses || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
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
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search by code or title..."
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-12 py-3 text-base focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition shadow-sm"
        />
      </div>

      <div 
        ref={containerRef}
        className="h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2"
      >
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {/* Course List */}
        <div className="space-y-3">
          {!isLoading &&
            courses.map((course: Course) => (
              <CourseCard
                key={course.id}
                course={course}
                section={section}
                setSection={setSection}
              />
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

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
