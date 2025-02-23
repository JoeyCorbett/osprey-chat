"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Hash, ArrowLeft } from "lucide-react";

const initialMessages = [
  { id: 1, sender: "Alice", content: "Hey everyone! Did anyone understand the homework?", avatarUrl: "/avatars/alice.png" },
  { id: 2, sender: "Bob", content: "I'm still working on it. Question 3 is tricky.", avatarUrl: "/avatars/bob.png" },
  { id: 3, sender: "You", content: "Yeah, I struggled with that too, but I figured it out!", avatarUrl: "/avatars/you.png" },
  { id: 4, sender: "You", content: "ok", avatarUrl: "/avatars/you.png" },
];

export default function ChatRoom() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId || "Unknown Course";

  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: "You", content: newMessage, avatarUrl: "/avatars/you.png" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/chats")}>
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Hash className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">{courseId} Chat</h2>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => {
          const isUser = message.sender === "You";
          const isSameSenderAsPrev = index > 0 && messages[index - 1].sender === message.sender;

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2 mb-3 last:mb-0`}
            >
              {/* Avatar (for non-user) -- only if this message is from a new sender */}
              {!isUser && !isSameSenderAsPrev && (
                <div className="self-end">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.avatarUrl} alt={`${message.sender}'s avatar`} />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed rounded-xl ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-accent text-accent-foreground rounded-bl-md"
                }`}
              >
                {/* Sender label if not user and not same as previous */}
                {!isUser && !isSameSenderAsPrev && (
                  <span className="block text-xs font-medium text-muted-foreground mb-1">
                    {message.sender}
                  </span>
                )}
                <p className="text-sm">{message.content}</p>
              </div>

              {/* Avatar (for user) -- only if this message is from a new sender */}
              {isUser && !isSameSenderAsPrev && (
                <div className="self-end">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.avatarUrl} alt="Your avatar" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>

      {/* Message Input (Added Extra Bottom Padding) */}
      <div className="p-4 pb-6 border-t border-border bg-card">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-muted border-border"
          />
          <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/80">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}