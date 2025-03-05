'use client'

import { Database } from '@/types/database.types'
import MessageItem from './MessageItem'

type Message = Database['public']['Tables']['messages']['Row']

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