'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MessageCircle, Search } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

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
        className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 p-4 md:hidden z-50 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="flex flex-col space-y-3">
          {/* Navigation Links */}
          <Link
            href="/chats"
            className="flex items-center justify-center text-center gap-2 w-full px-4 py-3 rounded-md text-gray-900 font-medium hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle size={20} className="text-gray-600" />
            Chats
          </Link>

          <Link
            href="/search"
            className="flex items-center justify-center text-center gap-2 w-full px-4 py-3 rounded-md text-gray-900 font-medium hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            <Search size={20} className="text-gray-600" />
            Search
          </Link>

          {/* Profile Section in a Row */}
          <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-gray-200">
            <Avatar className="h-10 w-10 border border-gray-300 shadow-sm">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-base font-semibold text-gray-900">
              {name}
            </span>
          </div>

          {/* Logout Button at the Bottom */}
          <LogoutButton isMobile={true} />
        </div>
      </div>
    </>
  )
}
