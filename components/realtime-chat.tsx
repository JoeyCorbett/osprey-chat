'use client'

import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { type ChatMessage, useRealtimeChat } from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { useEffect } from 'react'
import { ChatInput } from '@/components/chat-input'

interface RealtimeChatProps {
  roomId: string
  userId: string
  username: string
  avatar_url: string
  messages?: ChatMessage[]
}

/**
 * Realtime chat component
 * @param roomId - The id of the room to join. Each room is a unique chat.
 * @param userId - The user id of the user
 * @param username - The username of the user
 * @param avatar_url - The avatar url of the user
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomId,
  userId,
  username,
  avatar_url,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom, isUserAtBottom } = useChatScroll()

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom('smooth')
    }
  }, [isUserAtBottom, scrollToBottom])

  const {
    messages: allMessages,
    isConnected,
    sendMessage,
    deleteMessage,
    editMessage,
  } = useRealtimeChat({
    roomId,
    userId,
    username,
    avatar_url,
    initialMessages,
  })

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="flex flex-col justify-end min-h-full max-w-2xl w-full mx-auto">
          {allMessages.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 px-4">
              <MessageCircle className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 mb-3" />
              <p className="text-lg font-semibold">No messages yet</p>
              <p className="text-sm text-gray-400 max-w-xs">
                Start the conversation for this course!
              </p>
            </div>
          ) : null}
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader =
              !prevMessage || prevMessage.user_id !== message.user_id

            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user_id === userId}
                  showHeader={showHeader}
                  onDelete={() => deleteMessage(message.id)}
                  onEdit={editMessage}
                />
              </div>
            )
          })}
        </div>
      </div>

      {!isUserAtBottom && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <Button
            size="icon"
            variant="outline"
            type="button"
            className="rounded-full bg-background border text-foreground"
            onClick={() => scrollToBottom('smooth')}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}

      <ChatInput isConnected={isConnected} onSendMessageAction={sendMessage} />
    </div>
  )
}
