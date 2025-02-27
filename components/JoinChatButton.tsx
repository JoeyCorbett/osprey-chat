'use client'

import { Button } from './ui/button'

interface JoinChatButtonProps {
  courseCode: string
  section: string
}

export default function JoinChatButton({
  courseCode,
  section,
}: JoinChatButtonProps) {
  const handleJoin = async (courseCode: string, section: string) => {
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseCode, section: section }),
    })

    if (!res.ok) {
      console.error('Error: ', res.statusText)
      return
    }

    const data = await res.json()
    console.log('Chat created: ', data)
  }

  return (
    <Button onClick={() => handleJoin(courseCode, section)}>Join Chat</Button>
  )
}
