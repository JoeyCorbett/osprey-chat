'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import MessagesList from './MessagesList'
import { Database } from '@/types/database.types'
import { Skeleton } from './ui/skeleton'

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
}
type Profile = Database['public']['Tables']['profiles']['Row']

interface ChatRoomClientProps {
  roomId: string
  user_id: string
}

const supabase = createClient()

export default function ChatRoomClient({
  roomId,
  user_id,
}: ChatRoomClientProps) {
  const [messages, setMessages] = useState<Message[]>([])
  // Cache user profiles to avoid repeated fetches
  const userProfilesRef = useRef<{ [key: string]: Profile }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Fetch initial messages from API
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?roomId=${roomId}`)
        if (!res.ok) throw new Error('Failed to fetch messages')

        const fetchedMessages = await res.json()
        setMessages(fetchedMessages)

        fetchedMessages.forEach((msg: Message) => {
          if (msg.profiles && !userProfilesRef.current[msg.user_id]) {
            userProfilesRef.current[msg.user_id] = msg.profiles
          }
        })
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()

    // Real-time subscription for new messages
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
        async (payload) => {
          const newMessage = payload.new as Message

          // Check if profile is already cached
          let profile = userProfilesRef.current[newMessage.user_id]

          // if profile is missing, fetch it from the database
          if (!profile) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newMessage.user_id)
              .single()

            profile = profileData || {
              id: newMessage.user_id,
              username: 'Unknown User',
              avatar_url: null,
            }

            // Update profile cache to prevent repeated fetches
            userProfilesRef.current[newMessage.user_id] = profile
          }

          // Merge profile data into the new message
          const messageWithProfile: Message = {
            ...newMessage,
            profiles: profile,
          }

          setMessages((prev) => [...prev, messageWithProfile])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [roomId])

  if (error) return <p className="text-red-500">Failed to load messages.</p>
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 h-[70vh] w-full max-w-2xl mx-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-40 h-4 rounded-md" />
              <Skeleton className="w-60 h-4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <MessagesList
      messages={messages}
      user_id={user_id}
      userProfiles={userProfilesRef.current}
    />
  )
}
