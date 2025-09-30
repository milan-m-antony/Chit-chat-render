import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export type SocketData = {
  userId: string;
};

export type ClientToServerEvents = {
  message: (content: string, recipientId: string) => void;
  typing: (recipientId: string) => void;
  stopTyping: (recipientId: string) => void;
  markAsRead: (messageIds: string[]) => void;
};

export type ServerToClientEvents = {
  message: (message: {
    id: string;
    content: string;
    senderId: string;
    timestamp: Date;
  }) => void;
  typing: (senderId: string) => void;
  stopTyping: (senderId: string) => void;
  messageRead: (messageIds: string[]) => void;
  userStatusChange: (userId: string, status: 'online' | 'offline' | 'away') => void;
};

export class SocketService {
  private static io: SocketServer<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

  static async initialize(server: HTTPServer) {
    if (this.io) {
      console.log('Socket server already initialized');
      return;
    }

    this.io = new SocketServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Add authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const req = socket.request as NextApiRequest;
        const res = {} as NextApiResponse;
        
        const token = await getToken({ req });

        if (!token) {
          return next(new Error('Authentication failed'));
        }

        socket.data.userId = token.id as string;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });

    // Handle connections
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.data.userId}`);

      // Broadcast user's online status
      this.io.emit('userStatusChange', socket.data.userId, 'online');

      // Handle messages
      socket.on('message', async (content, recipientId) => {
        const message = {
          id: Math.random().toString(),
          content,
          senderId: socket.data.userId,
          timestamp: new Date(),
        };

        // Emit to recipient and sender
        socket.to(recipientId).emit('message', message);
        socket.emit('message', message);
      });

      // Handle typing indicators
      socket.on('typing', (recipientId) => {
        socket.to(recipientId).emit('typing', socket.data.userId);
      });

      socket.on('stopTyping', (recipientId) => {
        socket.to(recipientId).emit('stopTyping', socket.data.userId);
      });

      // Handle read receipts
      socket.on('markAsRead', (messageIds) => {
        socket.broadcast.emit('messageRead', messageIds);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.data.userId}`);
        this.io.emit('userStatusChange', socket.data.userId, 'offline');
      });
    });

    console.log('Socket server initialized');
  }

  static getIO() {
    if (!this.io) {
      throw new Error('Socket server not initialized');
    }
    return this.io;
  }
}