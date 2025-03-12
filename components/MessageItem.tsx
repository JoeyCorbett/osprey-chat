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
  showTimestamp: boolean
}

export default function MessageItem({
  message,
  user_id,
  isSameSenderAsPrev,
  showTimestamp,
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
      } ${showTimestamp ? 'mt-4' : 'mt-1'}`}
    >
      {/* show avatar only for the first message in a group OR if a 5-minute gap exists */}
      {showTimestamp && !isUserMessage && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt={profile.username || 'User'}
          width={36}
          height={36}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full mr-2 sm:mr-3 flex-shrink-0"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Adjust margin only for grouped messages  */}
      <div
        className={`relative px-3 py-2 sm:px-4 sm:py-2 max-w-[80%] sm:max-w-[75%] text-sm rounded-lg border ${
          isUserMessage
            ? `bg-blue-600 text-white ${
                isSameSenderAsPrev && !showTimestamp ? 'mr-10 sm:mr-12' : ''
              }`
            : `bg-gray-100 text-gray-900 ${
                isSameSenderAsPrev && !showTimestamp ? 'ml-10 sm:ml-12' : ''
              }`
        } shadow-sm`}
      >
        {/* Show username & timestamp only for first message in a group OR if 5+ min passed */}
        {showTimestamp && (
          <p
            className={`text-xs font-semibold ${
              isUserMessage ? 'text-white' : 'text-gray-700'
            } mb-1 sm:mb-2`}
          >
            {profile.username || 'Unknown User'}{' '}
            <span
              className={`text-xs font-normal ${
                isUserMessage ? 'text-white' : 'text-gray-700'
              }`}
            >
              • {format(new Date(message.created_at), 'h:mm a')}
            </span>
          </p>
        )}

        <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* Show avatar only for the first sent message in a group OR if a 5-minute gap exists */}
      {showTimestamp && isUserMessage && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Your Profile"
          width={32}
          height={32}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ml-2 sm:ml-3 flex-shrink-0"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )
}
