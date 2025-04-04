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
  const { data: messages } = useMessagesQuery(roomId)

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
