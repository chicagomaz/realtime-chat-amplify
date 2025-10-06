'use client';

import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import AttachmentUploader from './AttachmentUploader';
import { Conversation, Message, MessageType } from '@/types';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { getConversationMessages, sendMessageToConversation, getOrCreateUser } from '@/lib/api';
import { generateClient } from 'aws-amplify/api';
import * as subscriptions from '@/graphql/subscriptions';
import toast from 'react-hot-toast';

const client = generateClient();

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
      const userAttributes = await fetchUserAttributes();
      setCurrentUserId(user.userId);

      // Ensure user exists in database
      if (userAttributes.email) {
        await getOrCreateUser(userAttributes.email, user.userId);
      }

      await fetchMessages(user.userId);
      setupSubscriptions();
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId?: string) => {
    try {
      const userIdToUse = userId || currentUserId || 'current-user';

      // Fetch real messages from backend
      const realMessages = await getConversationMessages(conversation.id);

      // Map backend data to frontend Message type
      const mappedMessages: Message[] = realMessages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        authorId: msg.authorId,
        conversationId: msg.conversationId,
        type: msg.type as MessageType,
        isEdited: msg.isEdited || false,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        author: msg.author || {
          id: msg.authorId,
          email: 'unknown@example.com',
          username: 'unknown',
          displayName: msg.authorId === userIdToUse ? 'You' : 'User',
          isOnline: false,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
        },
      }));

      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to empty array on error
      setMessages([]);
    }
  };

  const setupSubscriptions = () => {
    // Subscribe to new messages in this conversation
    const subscription = (client.graphql({
      query: subscriptions.onCreateMessage,
      variables: { conversationId: conversation.id }
    }) as any).subscribe({
      next: ({ data }: any) => {
        const newMessage = data.onCreateMessage;
        if (newMessage && newMessage.authorId !== currentUserId) {
          // Only add messages from other users (our own are added optimistically)
          setMessages(prev => {
            // Check if message already exists
            if (prev.some(m => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, {
              id: newMessage.id,
              content: newMessage.content,
              authorId: newMessage.authorId,
              conversationId: newMessage.conversationId,
              type: newMessage.type as MessageType,
              isEdited: newMessage.isEdited || false,
              createdAt: newMessage.createdAt,
              updatedAt: newMessage.updatedAt,
              author: newMessage.author || {
                id: newMessage.authorId,
                email: 'unknown@example.com',
                username: 'unknown',
                displayName: 'User',
                isOnline: false,
                createdAt: newMessage.createdAt,
                updatedAt: newMessage.updatedAt,
              },
            }];
          });
        }
      },
      error: (error: any) => console.error('Subscription error:', error)
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    const messageContent = newMessage;
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: messageContent,
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
      // Send message to backend
      const result = await sendMessageToConversation(
        conversation.id,
        messageContent,
        'TEXT'
      );

      if (result) {
        // Update with real message from backend
        setMessages(prev => prev.map(msg =>
          msg.id === optimisticMessage.id ? {
            ...msg,
            id: result.id,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
          } : msg
        ));
      }
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

function generateMessagesForConversation(conversation: Conversation, currentUserId: string): Message[] {
  const baseTime = Date.now();
  const conversationData: { [key: string]: { otherUser: { name: string; email: string }; messages: Array<{ from: 'me' | 'other'; content: string; minutesAgo: number }> } } = {
    '1': {
      otherUser: { name: 'John Doe', email: 'john.doe@example.com' },
      messages: [
        { from: 'other', content: 'Hey! Did you finish the project proposal?', minutesAgo: 60 },
        { from: 'me', content: 'Yes! Just sent it over to the team.', minutesAgo: 58 },
        { from: 'other', content: 'Awesome, I\'ll review it this afternoon', minutesAgo: 55 },
        { from: 'me', content: 'Sounds good, let me know if you have any questions', minutesAgo: 50 },
        { from: 'other', content: 'Will do! Thanks for getting it done so quickly', minutesAgo: 45 },
      ]
    },
    '2': {
      otherUser: { name: 'Project Team', email: 'project@example.com' },
      messages: [
        { from: 'other', content: 'Team meeting at 3pm today', minutesAgo: 120 },
        { from: 'me', content: 'I\'ll be there!', minutesAgo: 118 },
        { from: 'other', content: 'Great! We\'ll discuss the Q4 roadmap', minutesAgo: 115 },
        { from: 'me', content: 'Perfect, I have some ideas to share', minutesAgo: 110 },
        { from: 'other', content: 'Looking forward to it! Bring the slides if you have them', minutesAgo: 100 },
        { from: 'me', content: 'Already prepared them. See you at 3!', minutesAgo: 95 },
      ]
    },
    '3': {
      otherUser: { name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
      messages: [
        { from: 'other', content: 'Hi! How was your weekend?', minutesAgo: 180 },
        { from: 'me', content: 'It was great! Went hiking. You?', minutesAgo: 175 },
        { from: 'other', content: 'Nice! I just relaxed at home, watched some movies', minutesAgo: 170 },
        { from: 'me', content: 'That sounds lovely. Any good recommendations?', minutesAgo: 165 },
        { from: 'other', content: 'Check out "The Holdovers" - really enjoyed it!', minutesAgo: 160 },
      ]
    },
    '4': {
      otherUser: { name: 'Design Team', email: 'design@example.com' },
      messages: [
        { from: 'other', content: 'New mockups are ready for review', minutesAgo: 300 },
        { from: 'me', content: 'Excellent! Where can I find them?', minutesAgo: 295 },
        { from: 'other', content: 'Shared in Figma - link in the project channel', minutesAgo: 290 },
        { from: 'me', content: 'Got it, reviewing now', minutesAgo: 280 },
        { from: 'other', content: 'Let us know your thoughts!', minutesAgo: 275 },
        { from: 'me', content: 'These look amazing! Love the color scheme', minutesAgo: 270 },
      ]
    },
    '5': {
      otherUser: { name: 'Mike Chen', email: 'mike.chen@example.com' },
      messages: [
        { from: 'other', content: 'Want to grab lunch tomorrow?', minutesAgo: 1440 },
        { from: 'me', content: 'Sure! What time works for you?', minutesAgo: 1430 },
        { from: 'other', content: 'How about 12:30?', minutesAgo: 1420 },
        { from: 'me', content: 'Perfect! The usual spot?', minutesAgo: 1410 },
        { from: 'other', content: 'Yeah, see you there!', minutesAgo: 1400 },
      ]
    },
    '6': {
      otherUser: { name: 'Marketing Team', email: 'marketing@example.com' },
      messages: [
        { from: 'other', content: 'Campaign results are in!', minutesAgo: 2880 },
        { from: 'me', content: 'How did we do?', minutesAgo: 2870 },
        { from: 'other', content: '150% above target! 🎉', minutesAgo: 2860 },
        { from: 'me', content: 'That\'s incredible! Great work everyone!', minutesAgo: 2850 },
        { from: 'other', content: 'Team effort! Thanks for your support', minutesAgo: 2840 },
      ]
    },
    '7': {
      otherUser: { name: 'Emily Rodriguez', email: 'emily.rodriguez@example.com' },
      messages: [
        { from: 'other', content: 'Can you send me the client contact info?', minutesAgo: 4320 },
        { from: 'me', content: 'Sure, which client?', minutesAgo: 4310 },
        { from: 'other', content: 'The one from the morning meeting', minutesAgo: 4300 },
        { from: 'me', content: 'Got it, sending now', minutesAgo: 4290 },
        { from: 'other', content: 'Received, thanks!', minutesAgo: 4280 },
      ]
    },
    '8': {
      otherUser: { name: 'Weekend Plans', email: 'weekend@example.com' },
      messages: [
        { from: 'other', content: 'Beach day on Saturday?', minutesAgo: 7200 },
        { from: 'me', content: 'I\'m in! What time?', minutesAgo: 7150 },
        { from: 'other', content: 'Let\'s meet at 10am', minutesAgo: 7100 },
        { from: 'me', content: 'Perfect! I\'ll bring snacks', minutesAgo: 7050 },
        { from: 'other', content: 'Great! I\'ll handle drinks', minutesAgo: 7000 },
      ]
    },
    '9': {
      otherUser: { name: 'Alex Kim', email: 'alex.kim@example.com' },
      messages: [
        { from: 'other', content: 'Did you see the game last night?', minutesAgo: 8640 },
        { from: 'me', content: 'Yes! What a finish!', minutesAgo: 8600 },
        { from: 'other', content: 'I know right! Can\'t believe that last play', minutesAgo: 8560 },
        { from: 'me', content: 'Best game of the season so far', minutesAgo: 8520 },
      ]
    },
    '10': {
      otherUser: { name: 'Development Team', email: 'dev@example.com' },
      messages: [
        { from: 'other', content: 'Deployment scheduled for Thursday', minutesAgo: 11520 },
        { from: 'me', content: 'All tests passing?', minutesAgo: 11500 },
        { from: 'other', content: 'Yes, everything looks good!', minutesAgo: 11480 },
        { from: 'me', content: 'Excellent work team!', minutesAgo: 11460 },
        { from: 'other', content: 'Thanks! Ready to ship 🚀', minutesAgo: 11440 },
      ]
    },
  };

  const data = conversationData[conversation.id] || {
    otherUser: { name: conversation.name || 'Unknown User', email: 'unknown@example.com' },
    messages: [
      { from: 'other', content: 'Hello!', minutesAgo: 10 },
      { from: 'me', content: 'Hi there!', minutesAgo: 5 },
    ]
  };

  return data.messages.map((msg, index) => {
    const isMe = msg.from === 'me';
    return {
      id: `${conversation.id}-${index}`,
      content: msg.content,
      authorId: isMe ? currentUserId : `user-${conversation.id}`,
      conversationId: conversation.id,
      type: MessageType.TEXT,
      isEdited: false,
      createdAt: new Date(baseTime - msg.minutesAgo * 60000).toISOString(),
      updatedAt: new Date(baseTime - msg.minutesAgo * 60000).toISOString(),
      author: {
        id: isMe ? currentUserId : `user-${conversation.id}`,
        email: isMe ? 'chicagomaz13@gmail.com' : data.otherUser.email,
        username: isMe ? 'chicagomaz13' : data.otherUser.name.toLowerCase().replace(' ', ''),
        displayName: isMe ? 'You' : data.otherUser.name,
        isOnline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  });
}