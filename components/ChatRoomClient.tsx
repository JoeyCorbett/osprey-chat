'use client'

import { useEffect, useState } from 'react'
import MessagesList from './MessagesList'
import { Database } from '@/types/database.types'

type Message = Database['public']['Tables']['messages']['Row']

interface ChatRoomClientProps {
  roomId: string
}

export default function ChatRoomClient({ roomId }: ChatRoomClientProps) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // 1. Fetch initial messages from an API or direct from Supabase
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${roomId}`)
      const data = await res.json()
      setMessages(data)
    }

    fetchMessages()

    // 2. Subscribe to real-time updates (Supabase Realtime or socket.io)
    
    
    // 3. Update state with new messages

    return () => {
      // Unsubscribe from real-time on unmount
    }
  }, [roomId])

  return (
    <MessagesList messages={messages} />
  )
}