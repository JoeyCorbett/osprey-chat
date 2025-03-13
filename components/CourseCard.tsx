import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChevronRight } from 'lucide-react'
import { Database } from '@/types/database.types'
import JoinCourseButton from '@/components/JoinCourseButton'
import { AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'

type Course = Database['public']['Tables']['courses']['Row']

interface CourseCardProps {
  course: Course
  section: string
  setSection: (value: string) => void
}

export default function CourseCard({
  course,
  section,
  setSection,
}: CourseCardProps) {
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) setSection('')
  }

  const validateSection = (value: string) => {
    if (value.length < 3) {
      setError('')
      return
    }

    const regex = /^0(0[1-9]|[1-4][0-9]|50)$/
    const numericValue = Number(value)

    if (!regex.test(value) || numericValue < 1 || numericValue > 50) {
      setError('Section number must be between 001 and 050')
    } else {
      setError('')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (/^\d{0,3}$/.test(value)) {
      setSection(value)
      validateSection(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
      <DialogContent className="sm:top-1/2 top-[35%] transform -translate-y-1/2">
        <DialogTitle>Enter Your Section</DialogTitle>
        <DialogDescription>
          Enter the section number for this course to join the chat.
        </DialogDescription>
        <p className="text-gray-600">
          {course.code} - {course.title}
        </p>
        <Input
          type="text"
          placeholder="Enter section (e.g., 002)"
          value={section}
          onChange={handleChange}
          maxLength={3}
          inputMode="numeric"
        />
        {error && (
          <div className="flex justify-center align-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-400 text-center text-sm">{error}</p>
          </div>
        )}
        <JoinCourseButton
          courseCode={course.code}
          section={section}
          error={error}
        />
      </DialogContent>
    </Dialog>
  )
}
