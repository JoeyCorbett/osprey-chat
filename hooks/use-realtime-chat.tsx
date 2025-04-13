'use client'

import { createClient } from '@/utils/supabase/client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UseRealtimeChatProps {
  roomId: string
  userId: string
  username: string
  avatar_url: string
  initialMessages: ChatMessage[]
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
  edited_at: string | null
  created_at: string
}

export function useRealtimeChat({
  roomId,
  userId,
  username,
  avatar_url,
  initialMessages,
}: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? [])
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Setup Subscription for all event types
  useEffect(() => {
    const setupSubscription = async () => {
      await supabase.realtime.setAuth()

      const newChannel = supabase.channel(roomId, {
        config: {
          private: true,
        },
      })

      newChannel
        .on('broadcast', { event: 'message' }, (payload) => {
          const newMessage = payload.payload as ChatMessage
          setMessages((current) =>
            current.some((msg) => msg.id === newMessage.id)
              ? current
              : [...current, newMessage].sort((a, b) =>
                  a.created_at.localeCompare(b.created_at),
                ),
          )
        })
        .on('broadcast', { event: 'message_updated' }, (payload) => {
          const updatedMessage = payload.payload as ChatMessage
          setMessages((current) =>
            current.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg,
            ),
          )
        })
        .on('broadcast', { event: 'message_deleted' }, (payload) => {
          const { messageId } = payload.payload
          setMessages((current) =>
            current.filter((msg) => msg.id !== messageId),
          )
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') setIsConnected(true)
        })

      setChannel(newChannel)

      return () => {
        supabase.removeChannel(newChannel)
      }
    }

    setupSubscription()
  }, [roomId, supabase])

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
        edited_at: null,
        created_at: new Date().toISOString(),
      }

      // optimistic update
      setMessages((current) => [...current, message])

      try {
        // Insert into database
        const { error } = await supabase.from('messages').insert({
          id: message.id,
          content,
          room_id: roomId,
          user_id: userId,
          created_at: message.created_at,
        })
        if (error) throw error

        // Broadcast to other clients
        await channel.send({
          type: 'broadcast',
          event: 'message',
          payload: message,
        })
      } catch (error) {
        console.error('Error sending message', error)
        toast.error('Failed to send message')
        // rollback
        setMessages((current) => current.filter((msg) => msg.id !== message.id))
      }
    },
    [channel, isConnected, userId, roomId, username, avatar_url, supabase],
  )

  const editMessage = useCallback(
    async (id: string, content: string) => {
      if (!channel || !isConnected) return

      const originalMessage = messages.find((msg) => msg.id === id)

      if (!originalMessage) {
        console.error('Message not found')
        toast.error('Message not found')
        return
      }

      const timestamp = new Date().toISOString()
      setMessages((current) =>
        current.map((msg) =>
          msg.id === id ? { ...msg, content, edited_at: timestamp } : msg,
        ),
      )

      try {
        const { data, error } = await supabase
          .from('messages')
          .update({ content, edited_at: timestamp })
          .eq('id', id)
          .select()
          .single()
        if (error) throw error

        await channel.send({
          type: 'broadcast',
          event: 'message_updated',
          payload: data,
        })
      } catch (error) {
        console.error('Error editing message:', error)
        toast.error('Failed to edit message')
        setMessages((current) =>
          current.map((msg) => (msg.id === id ? originalMessage : msg)),
        )
      }
    },
    [isConnected, supabase, channel, messages],
  )

  const deleteMessage = useCallback(
    async (id: string) => {
      if (!channel || !isConnected) return

      const deletedMessage = messages.find((msg) => msg.id === id)
      if (!deletedMessage) return

      setMessages((current) => current.filter((msg) => msg.id !== id))

      try {
        const { error } = await supabase.from('messages').delete().eq('id', id)
        if (error) throw error

        await channel.send({
          type: 'broadcast',
          event: 'message_deleted',
          payload: { messageId: id },
        })
      } catch (error) {
        console.error('Error deleting message:', error)
        toast.error('Failed to delete message', {
          position: 'top-right',
        })
        // More efficient rollback
        setMessages((current) => {
          const messageExists = current.some((msg) => msg.id === id)
          if (messageExists) return current
          return [...current, deletedMessage].sort((a, b) =>
            a.created_at.localeCompare(b.created_at),
          )
        })
      }
    },
    [channel, isConnected, messages, supabase],
  )

  return { messages, sendMessage, isConnected, deleteMessage, editMessage }
}
