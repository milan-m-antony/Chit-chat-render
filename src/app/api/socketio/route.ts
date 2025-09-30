import { Server as NetServer } from 'http';
import { SocketService } from '@/lib/socket';
import { NextRequest } from 'next/server';

// Set runtime to edge for better performance
export const runtime = 'edge';

// Configure the API route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  return new Response('Socket.IO endpoint ready', { status: 200 });
}

export async function POST(req: NextRequest) {
  return new Response('Socket.IO endpoint ready', { status: 200 });
}