'use client'

import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
}

interface RoomMember {
  user_id: string
  profiles: Profile
}

interface RoomUsersPopoverProps {
  roomId: string
}

export default function RoomUsersPopover({ roomId }: RoomUsersPopoverProps) {
  const [users, setUsers] = useState<RoomMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoomUsers = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/room-users?roomId=${roomId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch room users')
        }
        
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError('Could not load users')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRoomUsers()
  }, [roomId])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Show room users">
          <Users className="w-6 h-6 text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium text-sm">People in this room</h3>
          <p className="text-xs text-gray-500 mt-1">{users.length} {users.length === 1 ? 'person' : 'people'}</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-red-500">{error}</div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="p-2">
              {users.map((user) => (
                <div key={user.user_id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                  <Avatar className="h-8 w-8">
                    {user.profiles.avatar_url ? (
                      <AvatarImage 
                        src={user.profiles.avatar_url} 
                        alt={user.profiles.username} 
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <AvatarFallback>
                      {user.profiles.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">{user.profiles.username}</div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  No users found
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}