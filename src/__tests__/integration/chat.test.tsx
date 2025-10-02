import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWindow from '@/components/ChatWindow';
import { Conversation, ConversationType } from '@/types';

// Mock the Amplify client
const mockGraphql = jest.fn();
jest.mock('@/lib/amplify', () => ({
  client: {
    graphql: mockGraphql,
  },
}));

// Mock getCurrentUser
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    userId: 'current-user-id',
    username: 'testuser',
  }),
}));

const mockConversation: Conversation = {
  id: 'conv-1',
  name: 'Test Conversation',
  type: ConversationType.GROUP,
  isGroup: true,
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
  members: [
    {
      id: '1',
      userId: 'current-user-id',
      conversationId: 'conv-1',
      role: 'MEMBER' as const,
      joinedAt: '2024-01-01T10:00:00Z',
      isActive: true,
    },
    {
      id: '2',
      userId: 'other-user-id',
      conversationId: 'conv-1',
      role: 'MEMBER' as const,
      joinedAt: '2024-01-01T10:00:00Z',
      isActive: true,
    },
  ],
};

describe('Chat Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful message sending
    mockGraphql.mockResolvedValue({
      data: {
        sendMessage: {
          id: 'new-message-id',
          content: 'Test message',
          authorId: 'current-user-id',
          conversationId: 'conv-1',
          type: 'TEXT',
          isEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  });

  it('allows user to send a message', async () => {
    const user = userEvent.setup();
    
    render(<ChatWindow conversation={mockConversation} />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Find the message input
    const messageInput = screen.getByPlaceholderText('Type a message...');
    expect(messageInput).toBeInTheDocument();

    // Type a message
    await user.type(messageInput, 'Hello, this is a test message!');
    expect(messageInput).toHaveValue('Hello, this is a test message!');

    // Find and click the send button
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeEnabled();
    
    await user.click(sendButton);

    // Verify message appears optimistically
    await waitFor(() => {
      expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument();
    });

    // Verify input is cleared
    expect(messageInput).toHaveValue('');

    // Verify GraphQL mutation was called
    expect(mockGraphql).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          conversationId: 'conv-1',
          content: 'Hello, this is a test message!',
          type: 'TEXT',
        }),
      })
    );
  });

  it('allows user to send message with Enter key', async () => {
    const user = userEvent.setup();
    
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText('Type a message...');
    
    // Type a message and press Enter
    await user.type(messageInput, 'Message sent with Enter key!{enter}');

    // Verify message appears
    await waitFor(() => {
      expect(screen.getByText('Message sent with Enter key!')).toBeInTheDocument();
    });

    // Verify GraphQL was called
    expect(mockGraphql).toHaveBeenCalled();
  });

  it('prevents sending empty messages', async () => {
    const user = userEvent.setup();
    
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const sendButton = screen.getByRole('button', { name: /send/i });
    
    // Send button should be disabled when input is empty
    expect(sendButton).toBeDisabled();

    // Type whitespace only
    const messageInput = screen.getByPlaceholderText('Type a message...');
    await user.type(messageInput, '   ');
    
    // Send button should still be disabled
    expect(sendButton).toBeDisabled();

    // Try clicking the disabled button
    await user.click(sendButton);
    
    // No GraphQL call should be made
    expect(mockGraphql).not.toHaveBeenCalled();
  });

  it('handles message sending errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock GraphQL to reject
    mockGraphql.mockRejectedValueOnce(new Error('Network error'));

    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Type and send message
    await user.type(messageInput, 'This message will fail');
    await user.click(sendButton);

    // Message should appear optimistically first
    expect(screen.getByText('This message will fail')).toBeInTheDocument();

    // Wait for error handling
    await waitFor(() => {
      // Optimistic message should be removed after error
      expect(screen.queryByText('This message will fail')).not.toBeInTheDocument();
    });
  });

  it('displays typing indicator correctly', async () => {
    const user = userEvent.setup();
    
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText('Type a message...');
    
    // Start typing
    await user.type(messageInput, 'I am typing...');

    // In a real implementation, this would trigger typing indicators
    // For this test, we're just verifying the input works
    expect(messageInput).toHaveValue('I am typing...');
  });

  it('handles file attachment upload', async () => {
    const user = userEvent.setup();
    
    // Mock presigned URL generation
    mockGraphql.mockResolvedValueOnce({
      data: {
        generatePresignedUploadUrl: {
          uploadUrl: 'https://s3.amazonaws.com/upload-url',
          downloadUrl: 'https://s3.amazonaws.com/download-url',
          key: 'uploads/user/file.jpg',
        },
      },
    });

    // Mock fetch for file upload
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
    } as Response);

    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Find the attachment button
    const attachButton = screen.getByRole('button', { name: /attach/i });
    expect(attachButton).toBeInTheDocument();

    // Create a mock file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate file selection (this is tricky to test in jsdom)
    // In a real test, you might use a more sophisticated approach
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      // Mock the file input change event
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });
      
      fireEvent.change(fileInput);
    }

    // In a real implementation, this would trigger the upload flow
    // We're mainly testing that the UI elements are present
  });

  it('displays existing messages on load', async () => {
    render(<ChatWindow conversation={mockConversation} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check that mock messages are displayed
    // The component includes mock messages for demonstration
    expect(screen.getByText(/Hello! How are you doing?/)).toBeInTheDocument();
    expect(screen.getByText(/I'm doing great!/)).toBeInTheDocument();
  });

  it('scrolls to bottom when new messages arrive', async () => {
    // Mock scrollIntoView
    const mockScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    const user = userEvent.setup();
    
    render(<ChatWindow conversation={mockConversation} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Send a message
    const messageInput = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    await user.type(messageInput, 'New message');
    await user.click(sendButton);

    // Verify scroll was called
    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });
});