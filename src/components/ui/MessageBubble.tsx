'use client';

import { useState } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Avatar } from './Avatar';
import DOMPurify from 'dompurify';

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isOwn: boolean;
  isRead?: boolean;
  sender?: {
    name: string;
    avatar?: string;
  };
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  isRead,
  sender
}: MessageBubbleProps) {
  const [showTime, setShowTime] = useState(false);
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className={`flex items-end gap-2 mb-4 group ${
        isOwn ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {!isOwn && sender && (
        <Avatar
          src={sender.avatar}
          alt={sender.name}
          size="sm"
          className="mb-1"
        />
      )}
      <div className="flex flex-col">
        {!isOwn && sender && (
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {sender.name}
          </span>
        )}
        <div
          className={`relative max-w-md rounded-2xl px-4 py-2 group-hover:shadow-sm ${
            isOwn
              ? 'bg-primary-500 text-white rounded-br-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
          }`}
          onClick={() => setShowTime(!showTime)}
        >
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          <div
            className={`absolute bottom-1 ${
              isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
            } flex items-center gap-1 text-xs text-gray-500 px-2 opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <span>{formatDate(timestamp)}</span>
            {isOwn && (
              <div className="text-primary-500" data-testid="read-receipt">
                {isRead ? <CheckCheck size={16} /> : <Check size={16} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}