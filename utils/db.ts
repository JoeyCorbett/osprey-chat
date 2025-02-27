import { createClient } from './supabase/server'
import { Database } from '@/types/database.types'

type CourseMemberInsert =
  Database['public']['Tables']['course_members']['Insert']

/**
 * Inserts a user into a room in the 'course_members' table
 * @param userId - The user's ID
 * @param roomId - The room's ID
 * @returns The room id or an error message
 */

export async function insertUserIntoRoom(userId: string, roomId: string) {
  const supabase = await createClient()

  const newMember: CourseMemberInsert = {
    user_id: userId,
    room_id: roomId,
  }

  const { error } = await supabase.from('course_members').insert([newMember])

  if (error) {
    console.error('Error adding user to room:', error.message)
    return { error: 'Failed to add user to room' }
  }

  return { success: true, roomId }
}
