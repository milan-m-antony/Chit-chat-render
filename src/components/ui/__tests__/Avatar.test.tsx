import { render, screen } from '@testing-library/react';
import { Avatar } from '@/components/ui/Avatar';

describe('Avatar', () => {
  it('renders with image when src is provided', () => {
    render(<Avatar src="/test-avatar.jpg" alt="Test User" />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('test-avatar.jpg'));
    expect(image).toHaveAttribute('alt', 'Test User');
  });

  it('renders initials when no src is provided', () => {
    render(<Avatar alt="John Doe" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender } = render(<Avatar size="sm" alt="Test User" />);
    expect(screen.getByText('T').parentElement).toHaveClass('h-8');

    rerender(<Avatar size="md" alt="Test User" />);
    expect(screen.getByText('T').parentElement).toHaveClass('h-10');

    rerender(<Avatar size="lg" alt="Test User" />);
    expect(screen.getByText('T').parentElement).toHaveClass('h-12');
  });

  it('shows status indicator when status is provided', () => {
    const { rerender } = render(<Avatar alt="Test User" status="online" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('bg-green-500');

    rerender(<Avatar alt="Test User" status="offline" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('bg-gray-500');

    rerender(<Avatar alt="Test User" status="away" />);
    expect(screen.getByTestId('status-indicator')).toHaveClass('bg-yellow-500');
  });
});