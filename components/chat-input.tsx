'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface ChatInputProps {
  isConnected: boolean
  onSendMessageAction: (message: string) => void
}

export function ChatInput({ isConnected, onSendMessageAction }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !isConnected) return

    onSendMessageAction(message)
    setMessage('')
  }

  return (
    <div className="border-t border">
      <form
        onSubmit={handleSubmit}
        className="flex w-full gap-2 p-5 mx-auto max-w-2xl"
      >
        <Input
          className={cn(
            'rounded-full bg-background text-sm transition-all duration-300',
            isConnected && message.trim()
              ? 'w-[calc(100%-36px)]'
              : 'w-full',
          )}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        {isConnected && message.trim() && (
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
  )
} 