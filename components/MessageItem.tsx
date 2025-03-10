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
}

export default function MessageItem({ message, user_id }: MessageItemProps) {
        
  const isUserMessage = message.user_id === user_id
  const profile = message.profiles || {
    username: 'Unknown User',
    avatar_url: null,
  }

  return (
    <div
      className={`flex items-end ${
        isUserMessage ? 'justify-end' : 'justify-start'
      } mb-3`}
    >
      {!isUserMessage && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt={profile.username || 'User'}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full mr-3"
        />
      )}

      <div
        className={`relative px-4 py-3 max-w-[75%] text-sm rounded-xl ${
          isUserMessage
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 border text-gray-900'
        } shadow-sm`}
      >
        <p
          className={`text-xs font-semibold ${
            isUserMessage ? 'text-white' : 'text-gray-700'
          } mb-1`}
        >
          {profile.username || 'Unknown User'}{' '}
          <span
            className={`text-xs font-normal ${
              isUserMessage ? 'text-white' : 'text-gray-700'
            }`}
          >
            • {format(new Date(message.created_at), 'hh:mm a')}
          </span>
        </p>

        <p className="text-base leading-relaxed">{message.content}</p>
      </div>

      {isUserMessage && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Your Profile"
          width={36}
          height={36}
          className="w-9 h-9 rounded-full ml-3"
        />
      )}
    </div>
  )
}
