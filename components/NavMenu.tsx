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
import { MessageCircle, Search, LogOut } from 'lucide-react'

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
    <nav className="relative border-b border-gray-200 bg-white">
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
        <div className="hidden md:flex md:items-center md:space-x-5">
          <Link
            href="/chats"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md transition"
          >
            <MessageCircle size={20} className="text-gray-600" />
            Chats
          </Link>

          <Link
            href="/search"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-md transition"
          >
            <Search size={20} className="text-gray-600" />
            Search
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-9 w-9 select-none">
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
