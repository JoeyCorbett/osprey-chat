'use client'

import { useEffect, useRef } from 'react'
import { Database } from '@/types/database.types'
import MessageItem from './MessageItem'
import { MessageCircle } from 'lucide-react'

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
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="flex flex-col max-w-2xl gap-3 mx-auto w-full p-4 min-h-[80dvh] flex-1 relative"
    >
      {messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center text-gray-500">
            <MessageCircle className="w-14 h-14 text-gray-400 mb-3" />
            <p className="text-lg font-semibold">No messages yet</p>
            <p className="text-sm text-gray-400">
              Start the conversation for this course!
            </p>
          </div>
        </div>
      )}
      {messages.map((msg, index) => {
        const prevMessage = messages[index - 1]
        const isSameSenderAsPrev =
          index > 0 && messages[index - 1].user_id === msg.user_id

        const resetGroupBasedOnTime =
          !prevMessage ||
          new Date(msg.created_at).getTime() -
            new Date(prevMessage.created_at).getTime() >
            5 * 60 * 1000

        const shouldShowAvatarAndUsername =
          !isSameSenderAsPrev || resetGroupBasedOnTime

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
            showTimestamp={shouldShowAvatarAndUsername}
          />
        )
      })}
    </div>
  )
}
