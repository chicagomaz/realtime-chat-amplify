'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import ConversationCard from './ConversationCard';
import { Conversation, ConversationType } from '@/types';
import { client } from '@/lib/amplify';
import { getCurrentUser } from 'aws-amplify/auth';

export default function ConversationList() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.userId);
      await fetchConversations();
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      // This would be replaced with actual GraphQL query
      // const result = await client.graphql({
      //   query: getConversationsForUser,
      //   variables: { userId: currentUserId },
      // });
      
      // Mock data for now
      const mockConversations: Conversation[] = [
        {
          id: '1',
          name: 'John Doe',
          type: ConversationType.DIRECT,
          isGroup: false,
          lastMessageAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Project Team',
          type: ConversationType.GROUP,
          isGroup: true,
          lastMessageAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleCreateConversation = () => {
    // Navigate to create conversation page or open modal
    console.log('Create new conversation');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-md bg-white border-r border-gray-200 flex flex-col">
        <header className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateConversation}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                title="New conversation"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                title="Profile"
              >
                <UserIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-4 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start a new conversation to get chatting!
                </p>
                <button
                  onClick={handleCreateConversation}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start chatting
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  onClick={() => router.push(`/conversations/${conversation.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Select a conversation
          </h2>
          <p className="text-sm">
            Choose a conversation from the list to start chatting
          </p>
        </div>
      </div>
    </div>
  );
}