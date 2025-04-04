'use client'

import { RealtimeChat } from '@/components/realtime-chat'
import { useMessagesQuery } from '@/hooks/useMessagesQuery'

interface ChatPageProps {
  roomId: string
  user: {
    id: string
    username: string
    avatar_url: string
  }
}

export default function ChatPage({ roomId, user }: ChatPageProps) {
  const { data: messages = [], isLoading } = useMessagesQuery(roomId)

  if (isLoading) {
    return (
      // Loading spinner
      <div className="flex items-center justify-center h-[85vh] py-8">
        <div className="w-6 h-6 border-2 border-muted rounded-full border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <RealtimeChat
      roomId={roomId}
      userId={user.id}
      username={user.username}
      avatar_url={user.avatar_url}
      messages={messages}
    />
  )
}
