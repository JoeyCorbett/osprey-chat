import Image from 'next/image'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoutButton from '@/components/LogoutButton'
import MobileMenu from '@/components/MobileMenu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/utils/supabase/server'
import { LogOut } from 'lucide-react'

export default async function NavMenu() {
  const supabase = await createClient()

  const user = await supabase.auth.getUser()
  const name = user?.data?.user?.user_metadata?.name
  const avatar = user?.data?.user?.user_metadata?.avatar_url
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 md:py-4">
        <Link href="/chats" className="flex items-center space-x-2">
          <Image
            src="/light-icon.png"
            alt="Osprey Chat Logo"
            width={28}
            height={28}
            className="cursor-pointer"
            priority
          />
          <span className="text-lg font-semibold text-gray-900">
            Osprey Chat
          </span>
        </Link>
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/chats"
            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Course Chats
          </Link>

          <Link
            href="/search"
            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Find Courses
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{name}</DropdownMenuLabel>
              <DropdownMenuItem>
                <LogOut />
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <MobileMenu avatar={avatar} name={name} initials={initials} />
      </div>
    </nav>
  )
}
