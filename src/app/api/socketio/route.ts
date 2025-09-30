import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { SocketService } from '@/lib/socket';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!res.socket?.server?.io) {
    const httpServer: NetServer = res.socket.server as any;
    await SocketService.initialize(httpServer);
  }

  res.end();
}