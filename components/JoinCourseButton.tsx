import { useState } from 'react'
import { mutate } from 'swr'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface JoinChatButtonProps {
  courseCode: string
  section: string
  error: string
}

export default function JoinCourseButton({
  courseCode,
  section,
  error,
}: JoinChatButtonProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async (courseCode: string, section: string) => {
    if (error || section.length < 3) {
      toast.error('Section number must be between 001 and 050', {
        position: 'top-center',
      })
      return
    }

    if (isJoining) return
    setIsJoining(true)

    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseCode, section: section }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || data.message, {
        position: 'top-center',
      })
      setIsJoining(false)
      return
    }

    mutate('/api/my-courses', undefined, { revalidate: true })
    router.push('/chats')

    setTimeout(() => {
      toast.success(data.message, {
        closeButton: false,
      })
    }, 500)
  }

  return (
    <Button
      disabled={isJoining}
      onClick={() => handleJoin(courseCode, section)}
    >
      {isJoining ? 'Joining...' : 'Join Chat'}
    </Button>
  )
}
