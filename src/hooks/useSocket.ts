'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import type { ClientToServerEvents, ServerToClientEvents } from '@/lib/socket';

export function useSocket() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) return;

    // Initialize socket connection
    socketRef.current = io({
      path: '/api/socket',
      addTrailingSlash: false,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('userStatusChange', (userId, status) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (status === 'online') {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    });

    socket.on('typing', (userId) => {
      setTypingUsers(prev => new Set(prev).add(userId));
    });

    socket.on('stopTyping', (userId) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  const sendMessage = useCallback((content: string, recipientId: string) => {
    if (!socketRef.current?.connected) return false;
    socketRef.current.emit('message', content, recipientId);
    return true;
  }, []);

  const startTyping = useCallback((recipientId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('typing', recipientId);
  }, []);

  const stopTyping = useCallback((recipientId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('stopTyping', recipientId);
  }, []);

  const markAsRead = useCallback((messageIds: string[]) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('markAsRead', messageIds);
  }, []);

  return {
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    socket: socketRef.current,
  };
}