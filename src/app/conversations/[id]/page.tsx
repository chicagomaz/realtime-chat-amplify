'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ChatWindow from '@/components/ChatWindow';
import { Conversation, ConversationType, ConversationRole } from '@/types';
import { client } from '@/lib/amplify';
// import { getConversation } from '@/graphql/queries';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  const conversationId = params.id as string;

  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  const fetchConversation = async () => {
    try {
      // Mock conversation data for development
      const mockConversation: Conversation = {
        id: conversationId,
        name: 'Test Conversation',
        type: ConversationType.GROUP,
        isGroup: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [
          {
            id: '1',
            userId: 'user1',
            conversationId: conversationId,
            role: ConversationRole.MEMBER,
            joinedAt: new Date().toISOString(),
            isActive: true,
          }
        ]
      };
      
      setConversation(mockConversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Conversation not found
          </h2>
          <button
            onClick={() => router.push('/')}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to conversations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex items-center px-4 py-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => router.push('/')}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center">
          {conversation.avatar ? (
            <img
              src={conversation.avatar}
              alt={conversation.name || 'Conversation'}
              className="h-8 w-8 rounded-full mr-3"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {conversation.name?.[0] || '?'}
              </span>
            </div>
          )}
          
          <div>
            <h1 className="font-semibold text-gray-900">
              {conversation.name || 'Direct Message'}
            </h1>
            {conversation.isGroup && (
              <p className="text-sm text-gray-500">
                {conversation.members?.length || 0} members
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ChatWindow conversation={conversation} />
      </div>
    </div>
  );
}