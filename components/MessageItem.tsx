'use client'

import { Database } from '@/types/database.types'

type Message = Database['public']['Tables']['messages']['Row']

export default function MessageItem({ message }: { message: Message }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {message.user_id} — {(new Date(message.created_at), 'hh:mm a')}
      </p>
      <div className="text-base text-gray-900">{message.content}</div>
    </div>
  )
}