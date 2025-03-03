'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Hash, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export default function ChatRoom() {
  // Get the room_id from URL params
  const params = useParams();
  const roomId = params.room_id as string;
  const router = useRouter();
  
  // Create Supabase client with the new ssr package
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // State for messages and new message input
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to fetch room details
  const fetchRoomDetails = async () => {
    const { data, error } = await supabase
      .from('courses')  // Changed from 'rooms' to 'courses'
      .select('*')
      .eq('id', roomId)
      .single();
      
    if (error) {
      console.error('Error fetching room details:', error);
      return;
    }
    
    setRoom(data);
    setIsLoading(false);
  };

  // Load room details when component mounts
  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);
  
  // Function to load messages
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')  // Remove the profiles join
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    
    setMessages(data || []);
  };
  
  // Function to send a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Sending message:", newMessage);
    console.log("Current user:", user);
    
    if (!newMessage.trim() || !user) {
      console.log("Message or user missing, abort sending");
      return;
    }
    
    const messageToSend = {
      content: newMessage,
      room_id: roomId,
      user_id: user.id,
    };
    
    console.log("Message data to send:", messageToSend);
    
    const { error, data } = await supabase
      .from('messages')
      .insert(messageToSend)
      .select();
      
    if (error) {
      console.error('Error sending message:', error);
      return;
    }
    
    console.log("Message sent successfully:", data);
    setNewMessage('');
  };
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    fetchUser();
  }, [supabase]);
  
  // Load initial messages and setup real-time subscription
  useEffect(() => {
    // Load initial messages
    loadMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          // Fetch the complete message with user data
          const fetchNewMessage = async () => {
            const { data, error } = await supabase
              .from('messages')
              .select('*')  // Remove the profiles join
              .eq('id', payload.new.id)
              .single();
              
            if (error) {
              console.error('Error fetching new message details:', error);
              return;
            }
            
            setMessages(prev => [...prev, data]);
          };
          
          fetchNewMessage();
        }
      )
      .subscribe();
      
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);
  
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/chats')}
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Hash className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">
          {isLoading ? 'Loading...' : room?.name || roomId} Chat
        </h2>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => {
          const isUser = message.user_id === user?.id;
          const isSameSenderAsPrev =
            index > 0 && messages[index - 1].user_id === message.user_id;

          return (
            <div
              key={message.id}
              className={`flex ${
                isUser ? 'justify-end' : 'justify-start'
              } gap-2 mb-3 last:mb-0`}
            >
              {/* Avatar (for non-user) -- only if this message is from a new sender */}
              {!isUser && !isSameSenderAsPrev && (
                <div className="self-end">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{(message.user_name || 'Anonymous').charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed rounded-xl ${
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-accent text-accent-foreground rounded-bl-md'
                }`}
              >
                {/* Sender label if not user and not same as previous */}
                {!isUser && !isSameSenderAsPrev && (
                  <span className="block text-xs font-medium text-muted-foreground mb-1">
                    {message.user_name || 'Anonymous'}
                  </span>
                )}
                <p className="text-sm">{message.content}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>

              {/* Avatar (for user) -- only if this message is from a new sender */}
              {isUser && !isSameSenderAsPrev && (
                <div className="self-end">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{user?.email?.charAt(0) || 'Y'}</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 pb-6 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-muted border-border"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/80"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
