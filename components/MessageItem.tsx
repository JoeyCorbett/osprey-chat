'use client'

import { Database } from '@/types/database.types'
import { format } from 'date-fns'
import Image from 'next/image'

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
}

interface MessageItemProps {
  message: Message
  user_id: string
  isSameSenderAsPrev: boolean
}

export default function MessageItem({
  message,
  isSameSenderAsPrev,
  user_id,
}: MessageItemProps) {
  const isUserMessage = message.user_id === user_id
  const profile = message.profiles || {
    username: 'Unknown User',
    avatar_url: null,
  }

  return (
    <div
      className={`flex items-end ${
        isUserMessage ? 'justify-end' : 'justify-start'
      } ${isSameSenderAsPrev ? 'mb-2' : 'mt-4 mb-2'}`}
    >
      {!isUserMessage && !isSameSenderAsPrev && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt={profile.username || 'User'}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <div
        className={`relative px-4 py-2 max-w-[75%] text-sm rounded-lg ${
          isUserMessage ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'
        } shadow-md`}
      >
        {!isSameSenderAsPrev && (
          <p className="text-xs text-gray-400 mb-1">
            {profile.username || 'Unknown User'} •{' '}
            {format(new Date(message.created_at), 'hh:mm a')}
          </p>
        )}
        <p className="text-base leading-relaxed">{message.content}</p>
      </div>

      {isUserMessage && !isSameSenderAsPrev && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Your Profile"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full ml-2"
        />
      )}
    </div>
  )
}
