'use client';

import { useEffect, useRef, useState } from 'react';
import { UserList, type User } from '@/components/ui/UserList';
import { MessageBubble } from '@/components/ui/MessageBubble';
import { ChatInput } from '@/components/ui/ChatInput';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/components/providers/ChatProvider';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  isRead: boolean;
}

export default function ChatPage() {
  const { session } = useAuth();
  const { messages, sendMessage, selectedUserId, setSelectedUserId, whoIsTyping, onlineUsers } = useChat();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dummy data for demonstration
  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      status: 'online',
      statusMessage: 'Working on new features',
      avatar: '/avatars/john.png'
    },
    {
      id: '2',
      name: 'Jane Smith',
      status: 'away',
      statusMessage: 'In a meeting',
      avatar: '/avatars/jane.png'
    }
  ];

  const handleSendMessage = (content: string) => {
    if (!selectedUserId || !session?.user?.id) return;
    sendMessage(content, selectedUserId);
  };

  const handleTypingStart = () => {
    // Implement typing indicator logic
  };

  const handleTypingEnd = () => {
    // Implement typing indicator logic
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-20 w-64 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <UserList
          users={users}
          selectedUserId={selectedUserId}
          onUserSelect={setSelectedUserId}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </Button>
            {selectedUserId && (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">
                  {users.find(u => u.id === selectedUserId)?.name}
                </h1>
                <span className="text-sm text-gray-500">
                  {users.find(u => u.id === selectedUserId)?.statusMessage}
                </span>
              </div>
            )}
          </div>
          <ThemeToggle />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isOwn={message.senderId === session?.user?.id}
              isRead={message.isRead}
              sender={
                message.senderId !== session?.user?.id
                  ? {
                      name: users.find(u => u.id === message.senderId)?.name || '',
                      avatar: users.find(u => u.id === message.senderId)?.avatar,
                    }
                  : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingEnd={handleTypingEnd}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}