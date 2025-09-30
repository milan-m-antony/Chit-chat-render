import { render, screen, fireEvent } from '@testing-library/react';
import { MessageBubble } from '@/components/ui/MessageBubble';

describe('MessageBubble', () => {
  const defaultProps = {
    content: 'Hello, world!',
    timestamp: new Date('2025-09-30T12:00:00Z'),
    isOwn: false,
    isRead: false,
  };

  it('renders message content correctly', () => {
    render(<MessageBubble {...defaultProps} />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('displays sender information when not own message', () => {
    render(
      <MessageBubble
        {...defaultProps}
        sender={{
          name: 'John Doe',
          avatar: '/test-avatar.jpg',
        }}
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows read receipt for own messages', () => {
    render(
      <MessageBubble
        {...defaultProps}
        isOwn={true}
        isRead={true}
      />
    );
    expect(screen.getByTestId('read-receipt').closest('div')).toHaveClass('text-primary-500');
  });

  it('applies correct styles for own messages', () => {
    render(<MessageBubble {...defaultProps} isOwn={true} />);
    const messageContainer = screen.getByText('Hello, world!').closest('div[class*="relative"]');
    expect(messageContainer).toHaveClass('bg-primary-500');
  });

  it('applies correct styles for received messages', () => {
    render(<MessageBubble {...defaultProps} isOwn={false} />);
    const messageContainer = screen.getByText('Hello, world!').closest('div[class*="relative"]');
    expect(messageContainer).toHaveClass('bg-gray-100');
  });

  it('sanitizes HTML content', () => {
    const htmlContent = '<script>alert("xss")</script><p>Safe content</p>';
    render(<MessageBubble {...defaultProps} content={htmlContent} />);
    
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });
});