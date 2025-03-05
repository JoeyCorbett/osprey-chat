// components/MessageInput.tsx
'use client'

import React, { useState } from 'react'

interface MessageInputProps {
  roomId: string
  // onSendMessage?: (content: string) => void // if you want parent to handle logic
}

export default function MessageInput({ roomId }: MessageInputProps) {
  const [value, setValue] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return

    // Option 1: Call a Next.js API route to send the message
    // Option 2: Insert directly into Supabase
    // Option 3: Emit socket.io event

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