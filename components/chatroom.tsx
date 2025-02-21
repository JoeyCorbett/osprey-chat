"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Hash } from "lucide-react"

// Placeholder data (same as before)
const chatRooms = [
  { id: 1, name: "MATH-2226-001" },
  { id: 2, name: "PHYS-1121-002" },
  { id: 3, name: "CSCI-1100-003" },
  { id: 4, name: "ENGL-1101-001" },
  { id: 5, name: "CHEM-1211-002" },
]

const initialMessages = [
  { id: 1, sender: "Alice", content: "Hey everyone! Did anyone understand the homework assignment?" },
  { id: 2, sender: "Bob", content: "I'm still working on it. Question 3 is tricky." },
  { id: 3, sender: "Charlie", content: "I can help with that. Let's break it down step by step." },
  { id: 4, sender: "David", content: "Thanks for offering to help, Charlie!" },
  { id: 5, sender: "Eva", content: "I'm stuck on question 5. Any tips?" },
  { id: 6, sender: "Frank", content: "For question 5, remember to use the formula we learned last week." },
  { id: 7, sender: "Grace", content: "Oh, that makes sense. Thanks, Frank!" },
  { id: 8, sender: "Henry", content: "Is anyone else having trouble with the online submission system?" },
  {
    id: 9,
    sender: "Ivy",
    content: "Yeah, it seems to be down for maintenance. The professor just sent an email about it.",
  },
  { id: 10, sender: "Jack", content: "Thanks for the heads up, Ivy. I was worried it was just me." },
]

export default function ChatRoom() {
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: "You", content: newMessage }])
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with chat rooms */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200">
            <MessageCircle className="mr-2 h-6 w-6" />
            Osprey Chat
          </h1>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-2">
            {chatRooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedRoom.id === room.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1 py-2 px-3 h-auto text-sm font-medium"
                onClick={() => setSelectedRoom(room)}
              >
                <Hash className="mr-2 h-4 w-4" />
                {room.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Chat room header */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
          <Hash className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{selectedRoom.name}</h2>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 rounded-full">
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {message.sender[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{message.sender}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

