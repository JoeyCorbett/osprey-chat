'use client'

import { RealtimeChat } from '@/components/realtime-chat'
import { useMessagesQuery } from '@/hooks/useMessagesQuery'
import { storeMessages } from '@/utils/store-messages'
import { type ChatMessage } from '@/hooks/use-realtime-chat'

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
  const handleMessages = async (messages: ChatMessage[]) => {
    await storeMessages(messages)
  }

  return (
    <RealtimeChat
      roomId={roomId}
      userId={user.id}
      username={user.username}
      avatar_url={user.avatar_url}
      onMessage={handleMessages}
      messages={messages}
    />
  )
}
