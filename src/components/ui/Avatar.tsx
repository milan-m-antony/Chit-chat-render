'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export function Avatar({ 
  src, 
  alt = 'User avatar', 
  size = 'md', 
  status,
  className 
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500'
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div className={cn(
        'rounded-full overflow-hidden',
        sizes[size]
      )}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
            height={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
            className="object-cover"
          />
        ) : (
          <div className={cn(
            'flex items-center justify-center bg-gray-200 dark:bg-gray-700',
            sizes[size]
          )}>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      {status && (
        <span 
          data-testid="status-indicator"
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900',
            statusColors[status],
            size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
          )} 
        />
      )}
    </div>
  );
}