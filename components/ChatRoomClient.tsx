'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import MessagesList from './MessagesList'
import { Database } from '@/types/database.types'

type Message = Database['public']['Tables']['messages']['Row']

interface ChatRoomClientProps {
  roomId: string
}

const supabase = createClient()

export default function ChatRoomClient({ roomId }: ChatRoomClientProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Initial fetch
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?roomId=${roomId}`)
        if (!res.ok) throw new Error('Failed to fetch messages')
        setMessages(await res.json())
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    // Real-time subscription
    const subscription = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new] as Message[])
        },
      )
      .subscribe()

    fetchMessages()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [roomId])

  if (error) return <p className="text-red-500">Failed to load messages.</p>
  if (isLoading) return <p>Loading messages...</p>

  return <MessagesList messages={messages} />
}
