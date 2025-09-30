'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import { Button } from './Button';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingEnd: () => void;
}

export function ChatInput({
  onSendMessage,
  onTypingStart,
  onTypingEnd,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTyping = () => {
    onTypingStart();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onTypingEnd();
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="relative border-t dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Toggle emoji picker"
        >
          <Smile className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <textarea
            data-testid="message-input"
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full resize-none rounded-lg border-0 bg-gray-100 dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            rows={1}
            style={{ maxHeight: '150px' }}
          />
        </div>

        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="flex-shrink-0"
          aria-label="Send message"
          data-testid="send-button"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2" data-testid="emoji-picker">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          />
        </div>
      )}
    </div>
  );
}