'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { type ChatMessage, useRealtimeChat } from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface RealtimeChatProps {
  roomId: string
  userId: string
  username: string
  avatar_url: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

/**
 * Realtime chat component
 * @param roomId - The id of the room to join. Each room is a unique chat.
 * @param userId - The user id of the user
 * @param username - The username of the user
 * @param avatar_url - The avatar url of the user
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomId,
  userId,
  username,
  avatar_url,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom, isUserAtBottom } = useChatScroll()

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom('smooth')
    }
  }, [isUserAtBottom, scrollToBottom])

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomId,
    userId,
    username,
    avatar_url,
  })
  const [newMessage, setNewMessage] = useState('')

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m.id === message.id),
    )
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    )

    return sortedMessages
  }, [realtimeMessages, initialMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return

      sendMessage(newMessage)
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage],
  )

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="flex flex-col justify-end min-h-full max-w-2xl w-full mx-auto">
          {allMessages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground mx-auto">
              No messages yet. Start the conversation!
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
                  avatar_url={avatar_url}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full gap-2 p-5 mx-auto max-w-2xl"
        >
          {!isUserAtBottom && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-background border text-foreground"
                onClick={() => scrollToBottom('smooth')}
              >
                <ChevronDown className="w-3  h-3" />
              </Button>
            </div>
          )}
          <Input
            className={cn(
              'rounded-full bg-background text-sm transition-all duration-300',
              isConnected && newMessage.trim()
                ? 'w-[calc(100%-36px)]'
                : 'w-full',
            )}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          {isConnected && newMessage.trim() && (
            <Button
              className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
              type="submit"
              disabled={!isConnected}
            >
              <Send className="size-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
