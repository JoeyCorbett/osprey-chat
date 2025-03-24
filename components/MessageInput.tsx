'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

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

    if (res.status === 429) {
      toast.error(
        'You are sending messages too quickly. Please wait a few seconds.',
        { position: 'top-right' },
      )
      return
    }

    if (!res.ok) {
      console.error('Failed to send message')
      toast.error('Failed to send message. Please try again.', {
        position: 'top-right',
      })
      return
    }
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-2 border rounded-xl bg-white shadow-md max-w-[650px] mx-auto"
    >
      <input
        className="flex-1 px-4 p-2 border-none rounded-lg focus:outline-none"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        autoFocus
      />
      <button
        className={`p-2 flex items-center justify-center rounded-lg transition ${
          value.trim()
            ? 'bg-blue-600 hover:bg-blue-700 text-white border'
            : 'bg-gray-100 cursor-not-allowed border'
        }`}
        type="submit"
        disabled={!value.trim()}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}
