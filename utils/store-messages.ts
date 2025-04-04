import { ChatMessage } from '@/hooks/use-realtime-chat'
import { createClient } from '@/utils/supabase/client'

export const storeMessages = async (messages: ChatMessage[]) => {
  const supabase = createClient()

  if (messages.length === 0) return

  const formatted = messages.map((message) => ({
    id: message.id,
    content: message.content,
    user_id: message.user_id,
    room_id: message.room_id,
    created_at: message.createdAt,
  }))

  const { error } = await supabase.from('messages').upsert(formatted)

  if (error) {
    console.error('Error storing messages', error.message)
  }
}
