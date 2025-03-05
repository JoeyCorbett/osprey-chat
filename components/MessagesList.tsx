// components/MessagesList.tsx
'use client'

import MessageItem from './MessageItem'

interface Message {
  id: string
  content: string
  senderName: string
  created_at: string
}

interface MessagesListProps {
  messages: Message[]
}

export default function MessagesList({ messages }: MessagesListProps) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  )
}