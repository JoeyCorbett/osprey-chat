'use client'

import { Database } from '@/types/database.types'
import { format, isToday, isYesterday } from 'date-fns'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

/**
 * Helper function to format message time based on the date.
 * - If the message is from today, it returns "Today at [time]".
 * - If the message is from yesterday, it returns "Yesterday at [time]".
 * - Otherwise, it returns the date in the format "M/d/yyyy h:mm a".
 * 
 * @param timestamp - the timestamp of when the message was sent.
 * @returns the formatted message time as a string.
 */
function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`
  } else {
    return format(date, 'M/d/yyyy h:mm a')
  }
}

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null
}

interface MessageItemProps {
  message: Message
  user_id: string
  isSameSenderAsPrev: boolean
  showTimestamp: boolean
}

export default function MessageItem({
  message,
  user_id,
  isSameSenderAsPrev,
  showTimestamp,
}: MessageItemProps) {
  const [alertOpen, setAlertOpen] = useState(false)

  const isUserMessage = message.user_id === user_id
  const profile = message.profiles || {
    username: 'Unknown User',
    avatar_url: null,
  }

  /**const handleEdit = async () => {
    try {
      const res = await fetch(`/api/messages/${message.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message.content,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to update message')
      }

      const updatedMessage = await res.json()
      console.log('Message updated', updatedMessage)

      const data = await res.json()
      console.log('Message updated', data)
    } catch (err) {
      console.error('Fetch error', err)
    }
  } */

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/messages/${message.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete message')
    } catch {
      toast.error('Failed to delete message', {
        position: 'top-right',
      })
    }
  }

  return (
    <div
      className={`flex items-end ${
        isUserMessage ? 'justify-end' : 'justify-start'
      } ${showTimestamp ? 'mt-4' : 'mt-1'}`}
    >
      {/* show avatar only for the first message in a group OR if a 5-minute gap exists */}
      {showTimestamp && !isUserMessage && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt={profile.username || 'User'}
          width={36}
          height={36}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full mr-2 sm:mr-3 flex-shrink-0"
          referrerPolicy="no-referrer"
        />
      )}

      {isUserMessage ? (
        <>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                className={`relative px-3 py-2 sm:px-4 sm:py-2 max-w-[80%] sm:max-w-[75%] text-sm rounded-lg border
          bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 ease-in-out
          ${isSameSenderAsPrev && !showTimestamp ? 'mr-10 sm:mr-12' : ''}
          shadow-sm select-none sm:select-auto`}
              >
                {/* Show username & timestamp only for first message in a group OR if 5+ min passed */}
                {showTimestamp && (
                  <p
                    className={`text-xs font-semibold ${
                      isUserMessage ? 'text-white' : 'text-gray-700'
                    } mb-1 sm:mb-2`}
                  >
                    {profile.username || 'Unknown User'}{' '}
                    <span
                      className={`text-xs font-normal ${
                        isUserMessage ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      • {formatMessageTime(message.created_at)}
                    </span>
                  </p>
                )}
                <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() =>
                  toast.info('Edit feature coming soon', {
                    position: 'top-right',
                  })
                }
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => setAlertOpen(true)}
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this message? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div
          className={`relative px-3 py-2 sm:px-4 sm:py-2 max-w-[80%] sm:max-w-[75%] text-sm rounded-lg border
      bg-gray-100 text-gray-900 ${
        isSameSenderAsPrev && !showTimestamp ? 'ml-10 sm:ml-12' : ''
      }
      shadow-sm`}
        >
          {showTimestamp && (
            <p
              className={`text-xs font-semibold ${
                isUserMessage ? 'text-white' : 'text-gray-700'
              } mb-1 sm:mb-2`}
            >
              {profile.username || 'Unknown User'}{' '}
              <span
                className={`text-xs font-normal ${
                  isUserMessage ? 'text-white' : 'text-gray-700'
                }`}
              >
                • {formatMessageTime(message.created_at)}
              </span>
            </p>
          )}
          <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      )}

      {/* Show avatar only for the first sent message in a group OR if a 5-minute gap exists */}
      {showTimestamp && isUserMessage && (
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Your Profile"
          width={32}
          height={32}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ml-2 sm:ml-3 flex-shrink-0"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )
}
