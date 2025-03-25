import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { Database } from '@/types/database.types'
import JoinCourseButton from '@/components/JoinCourseButton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'

type Section = Database['public']['Tables']['sections']['Row']
type Course = Database['public']['Tables']['courses']['Row']

export default function CourseCard({ course }: { course: Course }) {
  const [courseInfo, setCourseInfo] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<Section>()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [sectionSelected, setSectionSelected] = useState(false)

  const fetchSections = async () => {
    if (courseInfo.length > 0) return

    setLoading(true)
    try {
      const response = await fetch(`/api/sections?courseId=${course.id}`)
      const data = await response.json()
      setCourseInfo(data)
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatSection(section: string) {
    return section.toString().padStart(3, '0')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) {
          fetchSections()
        } else {
          setSelectedSection(undefined)
          setSectionSelected(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <div>
          <Card className="hover:shadow-md cursor-pointer">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{course.code}</p>
                <p className="font-medium">{course.title}</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Select Your Section</DialogTitle>
        <DialogDescription>
          Select the section for this course below.
        </DialogDescription>
        <div className="space-y-4">
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-500" />
              </div>
            ) : courseInfo.length > 0 ? (
              courseInfo.map((info) => (
                <button
                  key={info.id}
                  onClick={() => {
                    setSelectedSection(info)
                    setSectionSelected(true)
                  }}
                  className={`w-full px-4 py-3 text-left rounded-lg border ${
                    selectedSection?.section === info.section
                      ? 'bg-black text-white border-gray-800 shadow-sm hover:bg-gray-900'
                      : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{course.code}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium">
                        {formatSection(info.section)}
                      </span>
                    </div>
                    <span
                      className={`text-sm ${
                        selectedSection?.section === info.section
                          ? 'text-blue-100'
                          : 'text-gray-600'
                      }`}
                    >
                      {info.instructor}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No sections available</p>
            )}
          </div>
          <JoinCourseButton
            courseId={course.id}
            sectionId={selectedSection?.id || ''}
            disabled={loading || !courseInfo.length || !sectionSelected}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
