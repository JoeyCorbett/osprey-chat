import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessagesSquare, Users, Zap, Send } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-12 py-4">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <a className="flex items-center justify-center" href="#">
            <MessagesSquare className="h-6 w-6" />
            <span className="ml-2 text-2xl font-bold">OspreyChat</span>
          </a>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Features
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              FAQ
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              About
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Contact
            </a>
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Connect with your classmates
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      OspreyChat helps you stay in touch with your classmates. Share messages, discuss coursework, and collaborate effortlessly throughout the semester.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <Link href="/login">
                    <Button className="w-full" size="lg">
                      Get Started
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Start chatting for free. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <div className="bg-gray-100 dark:bg-gray-800 -mx-12">
            <div className="px-12">
              <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                    <Card>
                      <CardHeader>
                        <Users className="h-10 w-10 mb-2" />
                        <CardTitle>Class Chats</CardTitle>
                        <CardDescription>Join chats for your classes and stay connected with classmates.</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <Zap className="h-10 w-10 mb-2" />
                        <CardTitle>Instant Messaging</CardTitle>
                        <CardDescription>Send and receive messages in real-time.</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <Send className="h-10 w-10 mb-2" />
                        <CardTitle>Direct Messages</CardTitle>
                        <CardDescription>Send private messages to your classmates directly.</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How it works</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Getting started with OspreyChat is easy. Follow these simple steps:
                  </p>
                  <ul className="grid gap-6">
                    <li className="flex items-center space-x-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                        <span className="text-2xl font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Sign Up</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Create your account in seconds</p>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                        <span className="text-2xl font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Join Class Chats</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Find and join your class group chats</p>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                        <span className="text-2xl font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Start Chatting</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Connect with classmates and discuss coursework</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-full max-w-sm">
                    <div className="absolute -left-4 -top-4 h-72 w-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-8 right-4 h-72 w-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 -left-4 h-72 w-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
                    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-lg shadow-2xl">
                      <div className="flex items-center space-x-4 mb-6">
                        <Avatar>
                          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm">Hey, how's it going?</p>
                        </div>
                        <div className="bg-blue-500 text-white p-3 rounded-lg ml-auto max-w-[80%]">
                          <p className="text-sm">Great! Just trying out this new chat app. It's pretty cool!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-gray-100 dark:bg-gray-800 -mx-12">
            <div className="px-12">
              <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
                    What our users say
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                    <Card>
                      <CardHeader>
                        <CardTitle>Amazing App!</CardTitle>
                        <CardDescription>
                          "ChatApp has revolutionized how I stay in touch with my friends. It's so easy to use!"
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder-avatar-1.jpg" alt="Sarah" />
                            <AvatarFallback>S</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Sarah L.</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Perfect for Teams</CardTitle>
                        <CardDescription>
                          "We use ChatApp for all our team communication. It's reliable and packed with features."
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder-avatar-2.jpg" alt="Michael" />
                            <AvatarFallback>M</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Michael R.</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Project Manager</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Keeps Us Connected</CardTitle>
                        <CardDescription>
                          "ChatApp helps me stay connected with my family overseas. The video calls are crystal clear!"
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/placeholder-avatar-3.jpg" alt="Emily" />
                            <AvatarFallback>E</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Emily C.</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Traveler</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to start chatting?
                  </h2>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Join your classmates already enjoying OspreyChat. Create an account in seconds and start chatting!
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
      </div>
      <div className="border-t">
        <div className="px-12">
          <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} OspreyChat. All rights reserved.</p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <a className="text-xs hover:underline underline-offset-4" href="#">
                Terms of Service
              </a>
              <a className="text-xs hover:underline underline-offset-4" href="#">
                Privacy
              </a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  )
}

