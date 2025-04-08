import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trash2, Pencil } from 'lucide-react'
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
import { toast } from 'sonner'
import { useState } from 'react'
import ChatBubble from '@/components/ChatBubble'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
  onDelete?: () => void
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  onDelete,
}: ChatMessageItemProps) => {
  const [alertOpen, setAlertOpen] = useState(false)

  const initials = message.profiles.username
    .split(' ')
    .map((name) => name[0])
    .join('')
    ?.toUpperCase()

  const editMessage = () => {
    toast.info('Edit feature coming soon!', {
      position: 'top-right',
    })
  }

  return (
    <div
      className={cn(
        'flex mt-2',
        isOwnMessage ? 'justify-end' : 'justify-start',
      )}
    >
      {showHeader && (
        <Avatar
          className={cn(
            'w-8 h-8 mt-auto',
            isOwnMessage ? 'order-2 ml-2' : 'mr-2',
          )}
        >
          <AvatarImage src={message.profiles.avatar_url} alt={initials} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-3', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <span className={'font-medium'}>{message.profiles.username}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
        {isOwnMessage ? (
          <>
            <ContextMenu>
              <ContextMenuTrigger>
                <ChatBubble
                  content={message.content}
                  isOwnMessage={isOwnMessage}
                />
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem className="gap-2" onClick={editMessage}>
                  <Pencil className="w-4 h-4" />
                  Edit
                </ContextMenuItem>
                <ContextMenuItem
                  className="gap-2"
                  onSelect={() => setAlertOpen(true)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">Delete</span>
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
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => onDelete?.()}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <ChatBubble content={message.content} isOwnMessage={isOwnMessage} />
        )}
      </div>
    </div>
  )
}
