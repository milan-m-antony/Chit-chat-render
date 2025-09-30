import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ChatProvider } from '@/components/providers/ChatProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chit-Chat - Real-time Chat Application',
  description: 'A secure, real-time chat application built with Next.js and Socket.IO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}