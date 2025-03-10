'use client'

import { Database } from '@/types/database.types'
import MessageItem from './MessageItem'
import { ScrollArea } from './ui/scroll-area'
import { useEffect, useRef } from 'react'

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
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight - scrollRef.current.clientHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  return (
    <ScrollArea
      ref={scrollRef}
      className="flex flex-col gap-3 p-4 h-[85vh] w-full max-w-2xl mx-auto bg-transparent"
    >
      {messages.map((msg, index) => {
        const isSameSenderAsPrev =
          index > 0 && messages[index - 1].user_id === msg.user_id

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
            isSameSenderAsPrev={isSameSenderAsPrev}
          />
        )
      })}
    </ScrollArea>
  )
}
