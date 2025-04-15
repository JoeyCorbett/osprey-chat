import Linkify from 'linkify-react'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  content: string
  isOwnMessage: boolean
}

export default function ChatBubble({ content, isOwnMessage }: ChatBubbleProps) {
  return (
    <>
      <div
        className={cn(
          'py-2 px-3 rounded-xl text-sm w-fit break-words whitespace-pre-wrap overflow-hidden max-w-full select-none md:select-auto',
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        )}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
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
    </>
  )
}
