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
 * - If the message is from today, it returns "[time]".
 * - If the message is from yesterday, it returns "Yesterday at [time]".
 * - Otherwise, it returns the date in the format "M/d/yyyy h:mm a".
 * 
 * @param timestamp - the timestamp of when the message was sent.
 * @returns the formatted message time as a string.
 */
function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  
  if (isToday(date)) {
    return `${format(date, 'h:mm a')}`
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
  showTimestamp: boolean
}

export default function MessageItem({
  message,
  user_id,
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
    <div className={`flex flex-col ${showTimestamp ? 'mt-4' : 'mt-0'}`}>
      {/* Message content */}
      <div className="flex">
        {/* Avatar - shown only when showTimestamp is true */}
        {showTimestamp && (
          <div className="flex-shrink-0 w-10 sm:w-12 mr-2">
            <Image
              src={profile.avatar_url || '/default-avatar.png'}
              alt={profile.username || 'User'}
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        {/* Empty space to align messages when no avatar is shown */}
        {!showTimestamp && (
          <div className="flex-shrink-0 w-10 sm:w-12 mr-2"></div>
        )}
        
        <div className="flex-1">
          {/* Username and timestamp - shown only when showTimestamp is true */}
          {showTimestamp && (
            <div className="flex items-baseline mb-1">
              <span className="font-semibold text-sm">
                {profile.username || 'Unknown User'}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {formatMessageTime(message.created_at)}
              </span>
            </div>
          )}
          
          {/* Message text */}
          {isUserMessage ? (
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="relative py-1 pl-0.5 rounded hover:bg-gray-200 transition-colors duration-200">
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
          ) : (
            <div className="relative py-1 pl-0.5">
              <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Keep the alert dialog for message deletion */}
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
    </div>
  )
}
