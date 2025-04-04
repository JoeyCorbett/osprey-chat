import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { ChatMessage } from './use-realtime-chat'

type MessagesRow = {
  id: string
  content: string
  created_at: string
  user_id: string
  room_id: string
  profiles: {
    username: string
    avatar_url: string
  }
}

export function useMessagesQuery(roomId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(
          'id, content, created_at, user_id, room_id, profiles(username, avatar_url)',
        )
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) throw new Error(error.message)

      return (data as unknown as MessagesRow[]).map((msg) => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.created_at,
        user_id: msg.user_id,
        room_id: msg.room_id,
        profiles: {
          username: msg.profiles.username,
          avatar_url: msg.profiles.avatar_url,
        },
      })) satisfies ChatMessage[]
    },
  })
}
