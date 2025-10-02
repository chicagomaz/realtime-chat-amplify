import { render, screen, fireEvent } from '@testing-library/react';
import MessageBubble from '../MessageBubble';
import { Message, MessageType } from '@/types';

const mockMessage: Message = {
  id: '1',
  content: 'Hello, this is a test message!',
  authorId: 'user-1',
  conversationId: 'conv-1',
  type: MessageType.TEXT,
  isEdited: false,
  createdAt: '2024-01-01T12:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z',
  author: {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
    isOnline: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
};

const mockOnReaction = jest.fn();

describe('MessageBubble', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message content correctly', () => {
    render(
      <MessageBubble 
        message={mockMessage} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('applies correct styling for own messages', () => {
    render(
      <MessageBubble 
        message={mockMessage} 
        isOwn={true} 
        onReaction={mockOnReaction} 
      />
    );

    const messageElement = screen.getByText('Hello, this is a test message!').closest('div');
    expect(messageElement).toHaveClass('bg-primary-500', 'text-white');
  });

  it('applies correct styling for other messages', () => {
    render(
      <MessageBubble 
        message={mockMessage} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    const messageElement = screen.getByText('Hello, this is a test message!').closest('div');
    expect(messageElement).toHaveClass('bg-white', 'border', 'border-gray-200', 'text-gray-900');
  });

  it('shows reaction picker on hover and calls onReaction when emoji is clicked', () => {
    render(
      <MessageBubble 
        message={mockMessage} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    const messageElement = screen.getByText('Hello, this is a test message!').closest('div');
    
    // Trigger mouse enter to show reactions
    if (messageElement) {
      fireEvent.mouseEnter(messageElement);
    }

    // Check if reaction picker is visible
    const thumbsUpButton = screen.getByText('👍');
    expect(thumbsUpButton).toBeInTheDocument();

    // Click on thumbs up reaction
    fireEvent.click(thumbsUpButton);
    expect(mockOnReaction).toHaveBeenCalledWith('👍');
  });

  it('displays formatted timestamp', () => {
    render(
      <MessageBubble 
        message={mockMessage} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    // Should show time in HH:MM format
    expect(screen.getByText(/12:00/)).toBeInTheDocument();
  });

  it('shows edited indicator when message is edited', () => {
    const editedMessage = {
      ...mockMessage,
      isEdited: true,
      editedAt: '2024-01-01T12:30:00Z',
    };

    render(
      <MessageBubble 
        message={editedMessage} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    expect(screen.getByText('(edited)')).toBeInTheDocument();
  });

  it('renders image attachments correctly', () => {
    const messageWithImage = {
      ...mockMessage,
      content: '',
      attachmentUrl: 'https://example.com/image.jpg',
      attachmentType: 'IMAGE' as const,
    };

    render(
      <MessageBubble 
        message={messageWithImage} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    const image = screen.getByRole('img', { name: 'Attachment' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders PDF attachments correctly', () => {
    const messageWithPDF = {
      ...mockMessage,
      content: '',
      attachmentUrl: 'https://example.com/document.pdf',
      attachmentType: 'PDF' as const,
      attachmentSize: 1024 * 1024, // 1MB
    };

    render(
      <MessageBubble 
        message={messageWithPDF} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    expect(screen.getByText('PDF Document')).toBeInTheDocument();
    expect(screen.getByText('1.00 MB')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('displays message reactions with counts', () => {
    const messageWithReactions = {
      ...mockMessage,
      reactions: [
        {
          id: '1',
          messageId: '1',
          userId: 'user-2',
          emoji: '👍',
          createdAt: '2024-01-01T12:01:00Z',
        },
        {
          id: '2',
          messageId: '1',
          userId: 'user-3',
          emoji: '👍',
          createdAt: '2024-01-01T12:02:00Z',
        },
        {
          id: '3',
          messageId: '1',
          userId: 'user-4',
          emoji: '❤️',
          createdAt: '2024-01-01T12:03:00Z',
        },
      ],
    };

    render(
      <MessageBubble 
        message={messageWithReactions} 
        isOwn={false} 
        onReaction={mockOnReaction} 
      />
    );

    // Check reaction counts
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 thumbs up
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 heart
  });

  it('shows read receipts for own messages', () => {
    const ownMessageWithReceipts = {
      ...mockMessage,
      authorId: 'current-user',
      readReceipts: [
        {
          id: '1',
          messageId: '1',
          userId: 'user-2',
          readAt: '2024-01-01T12:05:00Z',
        },
        {
          id: '2',
          messageId: '1',
          userId: 'user-3',
          readAt: '2024-01-01T12:06:00Z',
        },
      ],
    };

    render(
      <MessageBubble 
        message={ownMessageWithReceipts} 
        isOwn={true} 
        onReaction={mockOnReaction} 
      />
    );

    expect(screen.getByText('Read by 2')).toBeInTheDocument();
  });

  it('does not show author info for own messages', () => {
    render(
      <MessageBubble 
        message={mockMessage} 
        isOwn={true} 
        onReaction={mockOnReaction} 
      />
    );

    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });
});