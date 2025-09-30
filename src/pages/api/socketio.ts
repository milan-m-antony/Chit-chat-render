import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { SocketService } from '@/lib/socket';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  // res.socket may be undefined in some hosting environments, guard it
  if (res?.socket && !res.socket.server?.io) {
    const httpServer: NetServer = res.socket.server as any;
    await SocketService.initialize(httpServer);
  }

  res.end();
}
