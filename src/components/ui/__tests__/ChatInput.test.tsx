import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChatInput } from '@/components/ui/ChatInput';

jest.useFakeTimers();

describe('ChatInput', () => {
  const defaultProps = {
    onSendMessage: jest.fn(),
    onTypingStart: jest.fn(),
    onTypingEnd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text input and buttons', () => {
    render(<ChatInput {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /emoji/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /attach/i })).toBeInTheDocument();
  });

  it('handles message input and submission', () => {
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(defaultProps.onSendMessage).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });

  it('handles Enter key press for message submission', () => {
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(defaultProps.onSendMessage).toHaveBeenCalledWith('Hello');
  });

  it('prevents empty message submission', () => {
    render(<ChatInput {...defaultProps} />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    expect(defaultProps.onSendMessage).not.toHaveBeenCalled();
  });

  it('triggers typing indicators with debounce', () => {
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type a message...');
    
    fireEvent.change(input, { target: { value: 'H' } });
    expect(defaultProps.onTypingStart).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(defaultProps.onTypingEnd).toHaveBeenCalled();
  });

  it('toggles emoji picker', () => {
    render(<ChatInput {...defaultProps} />);
    
    const emojiButton = screen.getByRole('button', { name: /toggle emoji picker/i });
    
    fireEvent.click(emojiButton);
    expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();

    fireEvent.click(emojiButton);
    expect(screen.queryByTestId('emoji-picker')).not.toBeInTheDocument();
  });
});