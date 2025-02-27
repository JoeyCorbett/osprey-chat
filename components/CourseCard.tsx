import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChevronRight } from 'lucide-react'
import { Database } from '@/types/database.types'
import JoinChatButton from '@/components/JoinChatButton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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
  return (
    <Dialog>
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
      <DialogContent className="sm:top-1/2 top-[30%] transform -translate-y-1/2">
        <DialogTitle>Enter Your Section</DialogTitle>
        <p className="text-gray-600">
          {course.code} - {course.title}
        </p>
        <Input
          type="text"
          placeholder="Enter section (e.g., 002)"
          value={section}
          onChange={(e) => {
            const value = e.target.value
            if (/^\d{0,3}$/.test(value)) {
              setSection(value)
            }
          }}
          maxLength={3}
          pattern="\d{3}"
          inputMode="numeric"
        />
        <JoinChatButton courseCode={course.code} section={section} />
      </DialogContent>
    </Dialog>
  )
}
