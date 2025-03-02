import { toast } from 'sonner'
import { EllipsisVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CourseActionsProps {
  roomId: string
  onLeave: (roomId: string) => () => void
}

export default function CourseActions({ roomId, onLeave }: CourseActionsProps) {
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

    toast.success('Successfully left course')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLeave}>Leave Course</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
