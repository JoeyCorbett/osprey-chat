import { useState } from 'react'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { EllipsisVertical } from 'lucide-react'
import { Database } from '@/types/database.types'
import { LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type course_members = Database['public']['Tables']['course_members']['Row']

interface CourseActionsProps {
  roomId: string
}

export default function CourseActions({ roomId }: CourseActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLeave = async () => {
    mutate(
      '/api/my-courses',
      (currentCourses: course_members[] | undefined) =>
        (currentCourses ?? []).filter(
          (course: course_members) => course.room_id !== roomId,
        ),
      false,
    )

    const res = await fetch('/api/leave-course', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId }),
    })

    const data = await res.json()

    if (res.status === 429) {
      toast.error(
        'You are leaving courses too quickly. Please wait a few seconds.',
        {
          position: 'top-right',
        },
      )
      return
    }

    if (!res.ok) {
      console.error('Error leaving course', data.error)
      toast.error('Failed to leave course')
      mutate('/api/my-courses')
      return
    }

    mutate('/api/my-courses')

    toast.success('Successfully left course', {
      position: 'bottom-right',
      closeButton: false,
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 transition rounded-full"
          >
            <EllipsisVertical className="h-5 w-5 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 transition rounded-md"
          >
            <LogOut size={16} />
            Leave Course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Course?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this course? You will lose access
              to it&apos;s discussions and resources, but you can rejoin at any
              time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>
              Leave Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
