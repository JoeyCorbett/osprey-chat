'use client'

import { Database } from '@/types/database.types'
import MessageItem from './MessageItem'

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
}

type Profile = Database['public']['Tables']['profiles']['Row']

interface MessagesListProps {
  messages: Message[]
  user_id: string
  userProfiles: { [key: string]: Profile }
}

export default function MessagesList({
  messages,
  user_id,
  userProfiles,
}: MessagesListProps) {
  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full gap-3 p-4">
      {messages.map((msg) => {
        const profile = userProfiles?.[msg.user_id] ||
          msg.profiles || {
            id: msg.user_id,
            username: 'Unknown User',
            avatar_url: null,
          }
        return (
          <MessageItem
            key={msg.id}
            message={{ ...msg, profiles: profile }}
            user_id={user_id}
          />
        )
      })}
    </div>
  )
}
