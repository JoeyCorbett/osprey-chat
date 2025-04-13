import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { ChatMessage } from './use-realtime-chat'

export function useMessagesQuery(roomId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(
          'id, content, created_at, edited_at, user_id, room_id, profiles(username, avatar_url)',
        )
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) throw new Error(error.message)

      return data as unknown as ChatMessage[]
    },
  })
}
