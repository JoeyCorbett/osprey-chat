import { useState } from 'react'
import { toast } from 'sonner'
import { EllipsisVertical } from 'lucide-react'
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

interface CourseActionsProps {
  roomId: string
  onLeave: (roomId: string) => () => void
}

export default function CourseActions({ roomId, onLeave }: CourseActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLeave = async () => {
    onLeave(roomId)

    const rollback = onLeave(roomId)

    const res = await fetch('/api/leave-course', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: roomId }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Error leaving course', data.error)
      toast.error('Failed to leave course')
      rollback()
      return
    }

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
            className="h-8 w-8 hover:bg-gray-100 rounded-full"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="px-3 py-2"
          >
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
