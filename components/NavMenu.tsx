import Image from 'next/image'
import Link from 'next/link'
import MobileMenu from '@/components/MobileMenu'
import { createClient } from '@/utils/supabase/server'
import { MessageCircle, Search } from 'lucide-react'
import LogoutDropdown from '@/components/LogoutDropdown'
import { ModeToggle } from './ModeToggle'

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
    <nav className="relative border-b border-border">
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
          <span className="text-lg font-semibold text-foreground">
            Osprey Chat
          </span>
        </Link>
        <div className="hidden md:flex md:items-center md:space-x-5">
          <Link
            href="/chats"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-[var(--radius)] transition"
          >
            <MessageCircle size={20} className="text-muted-foreground" />
            Chats
          </Link>

          <Link
            href="/search"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-[var(--radius)] transition"
          >
            <Search size={20} className="text-muted-foreground" />
            Search
          </Link>
          <ModeToggle />
          <LogoutDropdown avatar={avatar} name={name} initials={initials} />
        </div>
        <MobileMenu avatar={avatar} name={name} initials={initials} />
      </div>
    </nav>
  )
}
