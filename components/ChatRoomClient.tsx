'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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

export default function ChatRoomClient({ roomId, user_id }: ChatRoomClientProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const userProfilesRef = useRef<{ [key: string]: Profile }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const isFetching = useRef(false)

  const fetchMessages = useCallback(async (currentCursor?: string | null) => {
    if (isFetching.current) return

    try {
      isFetching.current = true
      const isInitialFetch = !currentCursor

      if (isInitialFetch) setIsLoading(true)
      else setIsLoadingMore(true)

      const url = `/api/messages?roomId=${roomId}${currentCursor ? `&cursor=${currentCursor}` : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch messages')

      const { messages: fetchedMessages, hasMore: moreMessages, nextCursor } = await res.json()

      fetchedMessages.forEach((msg: Message) => {
        if (msg.profiles && !userProfilesRef.current[msg.user_id]) {
          userProfilesRef.current[msg.user_id] = msg.profiles
        }
      })

      setMessages(prev => (isInitialFetch ? fetchedMessages : [...fetchedMessages, ...prev]))
      setHasMore(moreMessages)
      setCursor(prevCursor => (nextCursor !== prevCursor ? nextCursor : prevCursor))
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError(err as Error)
    } finally {
      isFetching.current = false
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [roomId])

  useEffect(() => {
    fetchMessages()

    const subscription = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const newMessage = payload.new as Message
          let profile = userProfilesRef.current[newMessage.user_id]

          if (!profile) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newMessage.user_id)
              .single()

            profile = profileData || { id: newMessage.user_id, username: 'Unknown User', avatar_url: null }
            userProfilesRef.current[newMessage.user_id] = profile
          }

          setMessages((prev) => [...prev, { ...newMessage, profiles: profile }])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [fetchMessages, roomId])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-4">
        <p className="text-red-600 font-semibold text-lg">Something went wrong.</p>
        <p className="text-gray-600 text-sm mb-4">
          We couldn&apos;t load messages. Please check your connection and try again.
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
        onLoadMoreAction={() => hasMore && !isLoadingMore && fetchMessages(cursor)}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
    </div>
  )
}