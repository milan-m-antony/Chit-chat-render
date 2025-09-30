import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { SocketService } from '@/lib/socket';
import { Server as SocketIOServer } from 'socket.io';

// Extend the NextApiResponse type to include socket with server
interface SocketNextApiResponse extends NextApiResponse {
  socket: any;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: SocketNextApiResponse
) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    const httpServer: NetServer = res.socket.server;
    await SocketService.initialize(httpServer);
    console.log('Socket.IO server initialized');
  }
  res.end();
}