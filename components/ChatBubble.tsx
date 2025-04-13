import Linkify from 'linkify-react'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  content: string
  isOwnMessage: boolean
  edited: boolean
}

export default function ChatBubble({
  content,
  isOwnMessage,
  edited,
}: ChatBubbleProps) {
  return (
    <>
      <div
        className={cn(
          'py-2 px-3 rounded-xl text-sm w-fit break-words whitespace-pre-wrap overflow-hidden max-w-full',
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        )}
      >
        <Linkify
          options={{
            attributes: {
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'underline text-blue-500 break-all',
            },
          }}
        >
          {content}
        </Linkify>
      </div>
      {edited && (
        <div className="text-xs text-muted-foreground italic mt-1 text-right">
          (edited)
        </div>
      )}
    </>
  )
}
