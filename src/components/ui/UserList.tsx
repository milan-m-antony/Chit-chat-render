'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar } from './Avatar';
import { cn, formatRelativeTime } from '@/lib/utils';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  statusMessage?: string;
  lastSeen?: Date;
}

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  onUserSelect: (userId: string | null) => void;
}

export function UserList({
  users,
  selectedUserId,
  onUserSelect
}: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // Online users first
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    
    // Then away users
    if (a.status === 'away' && b.status === 'offline') return -1;
    if (a.status === 'offline' && b.status === 'away') return 1;
    
    // Finally sort by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedUsers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No users found
          </p>
        ) : (
          <ul className="p-2">
            {sortedUsers.map((user) => (
              <li key={user.id}>
                <button
                  onClick={() => onUserSelect(user.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-colors',
                    selectedUserId === user.id
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    status={user.status}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.name}
                      </p>
                      {user.lastSeen && user.status !== 'online' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(user.lastSeen)}
                        </span>
                      )}
                    </div>
                    {user.statusMessage && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.statusMessage}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}