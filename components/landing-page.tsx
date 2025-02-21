'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ChatCard from '@/components/chat-card'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MessagesSquare, Users, Zap, Send } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  // State to handle mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="w-full border-b">
        <div className="px-4 md:px-12 py-4">
          <header className="h-14 flex items-center">
            {/* Logo */}
            <a className="flex items-center" href="#">
              <MessagesSquare className="h-6 w-6" />
              <span className="ml-2 text-2xl font-bold">OspreyChat</span>
            </a>

            {/* Desktop Nav (hidden on small screens) */}
            <nav className="ml-auto hidden gap-4 sm:gap-6 md:flex">
              <a
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                Features
              </a>
              <a
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                FAQ
              </a>
              <a
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                About
              </a>
              <a
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                Contact
              </a>
            </nav>

            {/* Mobile Menu Button (visible on small screens) */}
            <button
              className="ml-auto md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {/* Simple “Hamburger” icon; you can replace with an SVG icon if you like */}
              <div className="w-6 h-0.5 bg-black dark:bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-black dark:bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-black dark:bg-white"></div>
            </button>
          </header>
        </div>

        {/* Mobile Menu (visible when toggled) */}
        {menuOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-900 px-4 py-2 border-t">
            <a
              className="block py-2 text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Features
            </a>
            <a
              className="block py-2 text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              FAQ
            </a>
            <a
              className="block py-2 text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              About
            </a>
            <a
              className="block py-2 text-sm font-medium hover:underline underline-offset-4"
              href="#"
            >
              Contact
            </a>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          {/* container is limited by px-4 on mobile and px-12 on md+ */}
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Connect with classmates instantly
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  No more scrambling to get your classmates into a GroupMe or Discord. 
                  Osprey Chat gives you instant access to chat rooms for your Stockton 
                  courses—no links, no invites, no hassle.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <div className="bg-gray-100 dark:bg-gray-800 w-full">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                <Card>
                  <CardHeader>
                    <Users className="h-10 w-10 mb-2" />
                    <CardTitle>Class Chats</CardTitle>
                    <CardDescription>
                      Join chats for your classes and stay connected with classmates.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Zap className="h-10 w-10 mb-2" />
                    <CardTitle>Instant Messaging</CardTitle>
                    <CardDescription>
                      Send and receive messages in real-time.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Send className="h-10 w-10 mb-2" />
                    <CardTitle>Direct Messages</CardTitle>
                    <CardDescription>
                      Send private messages to your classmates directly.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>
        </div>

        {/* Get Started Steps Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Get Started in Seconds
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No more hunting for Discord or GroupMe links. Osprey Chat makes it 
                  effortless to connect with classmates. Just follow these simple steps:
                </p>

                {/* Steps */}
                <ul className="grid gap-8">
                  {/* Step 1 */}
                  <li className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Sign In with Google</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Use your Stockton Google account to log in—no extra accounts needed.
                      </p>
                    </div>
                  </li>

                  {/* Step 2 */}
                  <li className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Find Your Classes</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Just enter your course IDs and we&apos;ll instantly 
                        connect you to the right chat rooms.
                      </p>
                    </div>
                  </li>

                  {/* Step 3 */}
                  <li className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Start Chatting Instantly</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Ask questions, share resources, and stay updated—all in real time.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Right Side: Chat UI Mockup */}
              <div className="flex items-center justify-center">
                <ChatCard />
              </div>

            </div>
          </div>
        </section>

        {/* NEW SECTION (ABOUT OSPREY CHAT) */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Built by Students, For Students
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Osprey Chat was built by Stockton students, for Stockton students—
                exclusively for our campus community. Only verified Stockton students
                can sign up—no spam, no outsiders. Just a seamless, real-time chat
                experience for your courses and connections. 🚀
              </p>
            </div>
          </div>
        </section>

        {/* Call To Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to start chatting?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join your classmates already enjoying OspreyChat. 
                  Create an account in seconds and start chatting!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/login">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="px-4 md:px-12">
          <div className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} OspreyChat. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <a className="text-xs hover:underline underline-offset-4" href="#">
                Terms of Service
              </a>
              <a className="text-xs hover:underline underline-offset-4" href="#">
                Privacy
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}