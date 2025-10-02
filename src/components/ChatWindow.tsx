'use client';

import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import AttachmentUploader from './AttachmentUploader';
import { Conversation, Message, MessageType } from '@/types';
import { client } from '@/lib/amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import toast from 'react-hot-toast';

interface ChatWindowProps {
  conversation: Conversation;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeChat();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.userId);
      await fetchMessages();
      setupSubscriptions();
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      // Mock messages for now
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hello! How are you doing?',
          authorId: 'other-user',
          conversationId: conversation.id,
          type: MessageType.TEXT,
          isEdited: false,
          createdAt: new Date(Date.now() - 60000).toISOString(),
          updatedAt: new Date(Date.now() - 60000).toISOString(),
          author: {
            id: 'other-user',
            email: 'other@example.com',
            username: 'otheruser',
            displayName: 'Other User',
            isOnline: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        {
          id: '2',
          content: "I'm doing great! Thanks for asking. How about you?",
          authorId: currentUserId || 'current-user',
          conversationId: conversation.id,
          type: MessageType.TEXT,
          isEdited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            id: currentUserId || 'current-user',
            email: 'current@example.com',
            username: 'currentuser',
            displayName: 'You',
            isOnline: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const setupSubscriptions = () => {
    // Setup real-time subscriptions for:
    // - New messages
    // - Typing indicators
    // - Read receipts
    // - Message reactions
    
    // Mock subscription setup
    console.log('Setting up subscriptions for conversation:', conversation.id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      authorId: currentUserId,
      conversationId: conversation.id,
      type: MessageType.TEXT,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: currentUserId,
        email: 'current@example.com',
        username: 'currentuser',
        displayName: 'You',
        isOnline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    // Optimistic update
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      // Send message via GraphQL mutation
      // const result = await client.graphql({
      //   query: sendMessage,
      //   variables: {
      //     conversationId: conversation.id,
      //     content: newMessage,
      //     type: 'TEXT',
      //   },
      // });

      // Update with real message ID
      // setMessages(prev => prev.map(msg => 
      //   msg.id === optimisticMessage.id ? result.data.sendMessage : msg
      // ));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!isTyping) {
      setIsTyping(true);
      // Send typing start event
      updateTypingStatus(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 2000);
  };

  const updateTypingStatus = async (typing: boolean) => {
    try {
      // Update typing status via GraphQL mutation
      // await client.graphql({
      //   query: updateTypingStatus,
      //   variables: {
      //     conversationId: conversation.id,
      //     isTyping: typing,
      //   },
      // });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentUpload = (url: string) => {
    // Handle file attachment
    console.log('Attachment uploaded:', url);
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      // Add or remove reaction via GraphQL mutation
      // await client.graphql({
      //   query: addReaction,
      //   variables: { messageId, emoji },
      // });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.authorId === currentUserId}
            onReaction={(emoji) => handleReaction(message.id, emoji)}
          />
        ))}
        
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <AttachmentUploader
            onUpload={handleAttachmentUpload}
            accept="image/*,.pdf"
            maxSize={10 * 1024 * 1024} // 10MB
          >
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <PaperClipIcon className="h-5 w-5" />
            </button>
          </AttachmentUploader>
          
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full max-h-32 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}