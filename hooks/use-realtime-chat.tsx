'use client'

import { createClient } from '@/utils/supabase/client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UseRealtimeChatProps {
  roomId: string
  userId: string
  username: string
  avatar_url: string
}

export interface ChatMessage {
  id: string
  content: string
  room_id: string
  user_id: string
  profiles: {
    username: string
    avatar_url: string
  }
  created_at: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({
  roomId,
  userId,
  username,
  avatar_url,
}: UseRealtimeChatProps) {
  const supabase = createClient()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const setupSubscription = async () => {
      await supabase.realtime.setAuth()

      const newChannel = supabase.channel(roomId, {
        config: {
          private: true,
        },
      })

      newChannel
        .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
          setMessages((current) => [...current, payload.payload as ChatMessage])
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
          }
        })

      setChannel(newChannel)

      return () => {
        supabase.removeChannel(newChannel)
      }
    }

    setupSubscription()
  }, [roomId, userId, supabase])

  const deleteMessage = useCallback(
    async (id: string) => {
      const messageToDelete = messages.find((msg) => msg.id === id)
      setMessages((prev) => prev.filter((msg) => msg.id !== id))

      const error = { message: 'Simulated deletion failure' }
      
      if (error && messageToDelete) {
        setMessages((prev) => [...prev, messageToDelete])
        console.error('Failed to delete message', error.message)
        toast.error('Failed to delete message.')
      }
    },
    [supabase, messages],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        room_id: roomId,
        user_id: userId,
        profiles: {
          username,
          avatar_url,
        },
        created_at: new Date().toISOString(),
      }

      // Update local state immediately for the sender
      setMessages((current) => [...current, message])

      try {
        // Insert into database
        const { error } = await supabase.from('messages').insert({
          id: message.id,
          content: message.content,
          room_id: message.room_id,
          user_id: message.user_id,
          created_at: message.created_at,
        })
        if (error) {
          console.error('Error sending message', error.message)
          toast.error('Error sending message', {
            position: 'top-right',
          })
          // Remove the message from the UI
          setMessages((current) =>
            current.filter((msg) => msg.id !== message.id),
          )
          return
        }

        // Broadcast to other clients
        await channel.send({
          type: 'broadcast',
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        })
      } catch (err) {
        console.error('sendMessage failed', err)
      }
    },
    [channel, isConnected, userId, roomId, username, avatar_url, supabase],
  )

  return { messages, sendMessage, isConnected, deleteMessage }
}
