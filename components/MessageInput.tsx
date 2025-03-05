'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface MessageInputProps {
  roomId: string
}

export default function MessageInput({ roomId }: MessageInputProps) {
  const [value, setValue] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return

    const res = await fetch(`/api/messages`, {
      method: 'POST',
      body: JSON.stringify({ roomId, content: value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      console.error('Failed to send message')
      toast.error('Failed to send message. Please try again.')
      return
    }
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="flex-1 p-2 border rounded-md"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        type="submit"
      >
        Send
      </button>
    </form>
  )
}
