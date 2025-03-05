// components/MessageItem.tsx
'use client'

import React from 'react'

interface Message {
  id: string
  content: string
  senderName: string
  created_at: string
}

export default function MessageItem({ message }: { message: Message }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {message.senderName} — {(new Date(message.created_at), 'hh:mm a')}
      </p>
      <div className="text-base text-gray-900">{message.content}</div>
    </div>
  )
}