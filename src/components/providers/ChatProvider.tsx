'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import { debounce } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string, recipientId: string) => void;
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
  isTyping: boolean;
  whoIsTyping: Set<string>;
  onlineUsers: Set<string>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { socket, onlineUsers, typingUsers, sendMessage: socketSendMessage } = useSocket();

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, { ...message, isRead: false }]);
    });

    socket.on('messageRead', (messageIds) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );
    });

    return () => {
      socket.off('message');
      socket.off('messageRead');
    };
  }, [socket]);

  // Handle message sending
  const sendMessage = useCallback(
    (content: string, recipientId: string) => {
      if (!session?.user?.id) return;

      const success = socketSendMessage(content, recipientId);
      if (!success) {
        console.error('Failed to send message');
        // Implement retry logic or show error to user
      }
    },
    [session?.user?.id, socketSendMessage]
  );

  // Typing indicator logic
  const debouncedStopTyping = debounce(() => {
    setIsTyping(false);
    if (selectedUserId) {
      socket?.emit('stopTyping', selectedUserId);
    }
  }, 1000);

  useEffect(() => {
    return () => {
      debouncedStopTyping.cancel();
    };
  }, []);

  const value = {
    messages,
    sendMessage,
    selectedUserId,
    setSelectedUserId,
    isTyping,
    whoIsTyping: typingUsers,
    onlineUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}