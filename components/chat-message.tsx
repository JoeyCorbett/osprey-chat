import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ChatBubble from '@/components/ChatBubble'
import { MessageActions } from '@/components/MessageActions'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
  onDelete?: () => void
  onEdit: (id: string, newContent: string) => void
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  onDelete,
  onEdit,
}: ChatMessageItemProps) => {
  const initials = message.profiles.username
    .split(' ')
    .map((name) => name[0])
    .join('')
    ?.toUpperCase()

  const isEdited = Boolean(message.edited_at)
  
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
          <MessageActions
            message={message}
            isOwnMessage={isOwnMessage}
            onEdit={onEdit}
            onDelete={() => onDelete?.()}
            edited={isEdited}
          />
        ) : (
          <ChatBubble
            content={message.content}
            isOwnMessage={isOwnMessage}
            edited={isEdited}
          />
        )}
      </div>
    </div>
  )
}
