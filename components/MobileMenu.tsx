'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface MobileMenuProps {
  avatar: string
  initials: string
  name: string
}

export default function MobileMenu({ avatar, initials, name }: MobileMenuProps) {
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
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-lg border-t border-gray-200 p-4 md:hidden z-50">
          <div className="flex flex-col space-y-3">

            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Avatar className="h-9 w-9 border border-gray-300 shadow-sm">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-900">{name}</span>
            </div>

            <Link
              href="/chats"
              className="w-full text-center py-3 rounded-md text-gray-900 font-medium hover:bg-gray-100 transition"
              onClick={() => setIsOpen(false)}
            >
              Course Chats
            </Link>

            <Link
              href="/search"
              className="w-full text-center py-3 rounded-md text-gray-900 font-medium hover:bg-gray-100 transition"
              onClick={() => setIsOpen(false)}
            >
              Find Courses
            </Link>

            <LogoutButton isMobile={true}/>
          </div>
        </div>
      )}
    </>
  )
}
