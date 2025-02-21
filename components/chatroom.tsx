"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, Users } from "lucide-react"

// This is a placeholder. In a real app, you'd fetch this data from Supabase
const chatRooms = [
  { id: 1, name: "MATH-2226-001" },
  { id: 2, name: "PHYS-1121-002" },
  { id: 3, name: "CSCI-1100-003" },
  { id: 4, name: "ENGL-1101-001" },
  { id: 5, name: "CHEM-1211-002" },
]

// This is a placeholder. In a real app, you'd fetch these messages from Supabase
const initialMessages = [
  { id: 1, sender: "Alice", content: "Hey everyone! Did anyone understand the homework assignment?" },
  { id: 2, sender: "Bob", content: "I'm still working on it. Question 3 is tricky." },
  { id: 3, sender: "Charlie", content: "I can help with that. Let's break it down step by step." },
]

export default function ChatRoom() {
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // In a real app, you'd send this message to Supabase here
      setMessages([...messages, { id: messages.length + 1, sender: "You", content: newMessage }])
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar with chat rooms */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold flex items-center">
            <MessageCircle className="mr-2 h-6 w-6" />
            Osprey Chat
          </h1>
        </div>
        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="p-2">
            {chatRooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedRoom.id === room.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => setSelectedRoom(room)}
              >
                <Users className="mr-2 h-4 w-4" />
                {room.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat room header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-xl font-semibold">{selectedRoom.name}</h2>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <Avatar>
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{message.sender}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">{message.content}</CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}