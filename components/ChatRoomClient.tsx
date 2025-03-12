'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import MessagesList from './MessagesList'
import { Database } from '@/types/database.types'

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
        setIsLoading(true);
        const res = await fetch(`/api/messages?roomId=${roomId}`)
        if (!res.ok) throw new Error('Failed to fetch messages')

        const fetchedMessages = await res.json()
        
        // Cache profiles
        fetchedMessages.forEach((msg: Message) => {
          if (msg.profiles && !userProfilesRef.current[msg.user_id]) {
            userProfilesRef.current[msg.user_id] = msg.profiles
          }
        })
        
        // Set messages immediately
        setMessages(fetchedMessages)
        
        // Use a small timeout to ensure DOM is ready
        setTimeout(() => {
          setIsLoading(false)
          console.log("Loading complete, messages:", fetchedMessages.length);
        }, 100);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err as Error)
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-4">
        <p className="text-red-600 font-semibold text-lg">
          Something went wrong.
        </p>
        <p className="text-gray-600 text-sm mb-4">
          We couldn&apos;t load messages. Please check your connection and try
          again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500" />
      </div>
    )
  }

  return (
    <div className="h-full">
      <MessagesList
        messages={messages}
        user_id={user_id}
        userProfiles={userProfilesRef.current}
      />
    </div>
  )
}
