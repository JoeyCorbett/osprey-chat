'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { createClient } from '@/utils/supabase/client'

export default function NavMenu() {
  const supabase = createClient()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Left: Logo & Name */}
        <Link href="/chats" className="flex items-center space-x-2">
          <Image
            src="/light-icon.svg"
            alt="Osprey Chat Logo"
            width={32}
            height={32}
            className="cursor-pointer"
            priority
          />
          <span className="text-lg font-semibold text-gray-900">
            Osprey Chat
          </span>
        </Link>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {/* My Courses Link */}
          <Link
            href="/chats"
            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Course Chats
          </Link>

          {/* Find Courses Link */}
          <Link
            href="/search"
            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Find Courses
          </Link>

          {/* Logout Button (Desktop) */}
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-lg border-t border-gray-200 p-4 md:hidden z-50">
          <div className="flex flex-col space-y-3">
            <Link
              href="/chats"
              className="w-full text-center py-3 rounded-md text-gray-900 font-medium hover:bg-gray-100 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Course Chats
            </Link>

            <Link
              href="/search"
              className="w-full text-center py-3 rounded-md text-gray-900 font-medium hover:bg-gray-100 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Courses
            </Link>

            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
