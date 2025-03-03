import { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface JoinChatButtonProps {
  courseCode: string
  section: string
}

export default function JoinCourseButton({
  courseCode,
  section,
}: JoinChatButtonProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async (courseCode: string, section: string) => {
    if (isJoining) return
    setIsJoining(true)

    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseCode, section: section }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || data.message)
      setIsJoining(false)
      return
    }

    router.push('/chats')

    setTimeout(() => {
      toast.success(data.message)
    }, 500)
  }

  return (
    <Button disabled={isJoining} onClick={() => handleJoin(courseCode, section)}>
      {isJoining ? 'Joining...' : 'Join Chat'}
    </Button>
  )
}