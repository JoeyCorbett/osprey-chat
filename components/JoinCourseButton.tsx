import { useState } from 'react'
import { mutate } from 'swr'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface JoinCourseButtonProps {
  courseId: string
  sectionId: string | undefined
  disabled: boolean
}

export default function JoinCourseButton({
  courseId,
  sectionId,
  disabled,
}: JoinCourseButtonProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async () => {
    if (isJoining) return
    setIsJoining(true)

    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, sectionId }),
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
      disabled={isJoining || disabled}
      onClick={handleJoin}
      className="w-full"
    >
      {isJoining ? 'Joining...' : 'Join Chat'}
    </Button>
  )
}
