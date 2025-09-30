import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';

// Mock the emoji-mart components
jest.mock('@emoji-mart/react', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="emoji-picker-content">Emoji Picker Content</div>,
  };
});

describe('ChatInput', () => {
  const mockOnSendMessage = jest.fn();
  const mockOnTypingStart = jest.fn();
  const mockOnTypingEnd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <ChatInput
        onSendMessage={mockOnSendMessage}
        onTypingStart={mockOnTypingStart}
        onTypingEnd={mockOnTypingEnd}
      />
    );

    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('handles message input correctly', async () => {
    render(
      <ChatInput
        onSendMessage={mockOnSendMessage}
        onTypingStart={mockOnTypingStart}
        onTypingEnd={mockOnTypingEnd}
      />
    );

    const input = screen.getByTestId('message-input');
    await userEvent.type(input, 'Hello');

    expect(input).toHaveValue('Hello');
    expect(mockOnTypingStart).toHaveBeenCalled();
  });

  it('sends message on button click', async () => {
    render(
      <ChatInput
        onSendMessage={mockOnSendMessage}
        onTypingStart={mockOnTypingStart}
        onTypingEnd={mockOnTypingEnd}
      />
    );

    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');

    await userEvent.type(input, 'Hello');
    await userEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });

  it('sends message on Enter key', async () => {
    render(
      <ChatInput
        onSendMessage={mockOnSendMessage}
        onTypingStart={mockOnTypingStart}
        onTypingEnd={mockOnTypingEnd}
      />
    );

    const input = screen.getByTestId('message-input');
    await userEvent.type(input, 'Hello{enter}');

    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });

  it('does not send empty messages', async () => {
    render(
      <ChatInput
        onSendMessage={mockOnSendMessage}
        onTypingStart={mockOnTypingStart}
        onTypingEnd={mockOnTypingEnd}
      />
    );

    const input = screen.getByTestId('message-input');
    const sendButton = screen.getByTestId('send-button');

    expect(sendButton).toBeDisabled();

    await userEvent.type(input, '   ');
    await userEvent.click(sendButton);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('shows emoji picker when emoji button is clicked', async () => {
    render(
      <ChatInput
        onSendMessage={mockOnSendMessage}
        onTypingStart={mockOnTypingStart}
        onTypingEnd={mockOnTypingEnd}
      />
    );

    const emojiButton = screen.getByLabelText('Toggle emoji picker');
    await userEvent.click(emojiButton);

    expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();
    expect(screen.getByTestId('emoji-picker-content')).toBeInTheDocument();
  });

  it('handles typing timeout for onTypingEnd', async () => {
    jest.useFakeTimers();

    render(
      <ChatInput
        onSendMessage={mockOnSendMessage}
        onTypingStart={mockOnTypingStart}
        onTypingEnd={mockOnTypingEnd}
      />
    );

    const input = screen.getByTestId('message-input');
    await userEvent.type(input, 'H');

    expect(mockOnTypingStart).toHaveBeenCalled();
    expect(mockOnTypingEnd).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(mockOnTypingEnd).toHaveBeenCalled();

    jest.useRealTimers();
  });
});