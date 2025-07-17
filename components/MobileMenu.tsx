'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MessageCircle, Search, LogOut, Moon, Sun, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useLogout } from '@/hooks/useLogout'
import { ModeToggle } from './ModeToggle'

interface MobileMenuProps {
  avatar: string
  initials: string
  name: string
}

export default function MobileMenu({
  avatar,
  initials,
  name,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const logout = useLogout()

  return (
    <>
      <button
        className="md:hidden py-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      <div
        className={`absolute top-full left-0 w-full bg-background shadow-lg border-t border-border p-4 md:hidden z-50 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="flex flex-col space-y-3">
          {/* Navigation Links */}
          <Link
            href="/chats"
            className="flex items-center justify-center text-center gap-2 w-full px-4 py-3 rounded-md text-foreground font-medium hover:bg-accent transition"
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle size={20} className="text-muted-foreground" />
            Chats
          </Link>

          <Link
            href="/search"
            className="flex items-center justify-center text-center gap-2 w-full px-4 py-3 rounded-md text-foreground font-medium hover:bg-accent transition"
            onClick={() => setIsOpen(false)}
          >
            <Search size={20} className="text-muted-foreground" />
            Search
          </Link>

          <div className="flex items-center justify-center text-center gap-2 w-full px-4 py-3 rounded-md text-foreground font-medium hover:bg-accent transition">
            
            <span className="flex items-center gap-2">
              <ModeToggle /> {/* TODO: Better implementation of this: either a separate ModeToggle for mobile, or integrate it into a settings menu */}
            </span>
          </div>

          {/* Profile Section in a Row */}
          <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-border">
            <Avatar className="h-10 w-10 border border-border shadow-sm">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-base font-semibold text-foreground">
              {name}
            </span>
          </div>

          <Button variant="outline" onClick={logout}>
            <LogOut />
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}
