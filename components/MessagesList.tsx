'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Database } from '@/types/database.types'
import MessageItem from './MessageItem'
import { MessageCircle, ArrowDown } from 'lucide-react'

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
}

type Profile = Database['public']['Tables']['profiles']['Row']

interface MessagesListProps {
  messages: Message[]
  user_id: string
  userProfiles: { [key: string]: Profile }
}

export default function MessagesList({
  messages,
  user_id,
  userProfiles,
}: MessagesListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const isNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    const { scrollTop } = scrollContainerRef.current;
    return scrollTop >= -10;
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || messages.length === 0) return

    if (isFirstLoad) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight
      setIsFirstLoad(false)
    } else if (isNearBottom()) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isFirstLoad, isNearBottom])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    setShowScrollButton(!isNearBottom())
  }

  return (
    <div className="h-full flex flex-col relative">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth overscroll-contain flex flex-col-reverse"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex flex-col">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[calc(100dvh-200px)]">
              <div className="flex flex-col items-center justify-center text-center text-gray-500 px-4 -mt-20">
                <MessageCircle className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 mb-3" />
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm text-gray-400 max-w-xs">
                  Start the conversation for this course!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="max-w-2xl gap-2 mx-auto w-full p-3 sm:p-4">
                {messages.map((msg, index) => {
                  const prevMessage = messages[index - 1]
                  const isSameSenderAsPrev =
                    index > 0 && messages[index - 1].user_id === msg.user_id

                  const resetGroupBasedOnTime =
                    !prevMessage ||
                    new Date(msg.created_at).getTime() -
                      new Date(prevMessage.created_at).getTime() >
                      5 * 60 * 1000

                  const shouldShowAvatarAndUsername =
                    !isSameSenderAsPrev || resetGroupBasedOnTime

                  const profile = userProfiles?.[msg.user_id] ||
                    msg.profiles || {
                      id: msg.user_id,
                      username: 'Unknown User',
                      avatar_url: null,
                    }
                  return (
                    <MessageItem
                      key={msg.id}
                      message={{ ...msg, profiles: profile }}
                      user_id={user_id}
                      showTimestamp={shouldShowAvatarAndUsername}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button - optimized for mobile */}
      {showScrollButton && messages.length > 0 && !isFirstLoad && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
          <button
            onClick={() =>
              scrollContainerRef.current?.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 flex items-center gap-1 px-3 py-3 pointer-events-auto animate-fadeIn"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
