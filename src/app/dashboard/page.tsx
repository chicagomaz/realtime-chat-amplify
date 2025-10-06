'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ConversationList from '@/components/ConversationList';
import ChatWindow from '@/components/ChatWindow';
import { Conversation, ConversationType, ConversationRole } from '@/types';
import '@/lib/amplify';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (conversationId) {
      // Fetch conversation by ID
      fetchConversation(conversationId);
    } else {
      setSelectedConversation(null);
    }
  }, [conversationId]);

  const fetchConversation = async (id: string) => {
    // Mock conversation data - replace with actual API call
    const conversationNames: { [key: string]: { name: string; isGroup: boolean } } = {
      '1': { name: 'John Doe', isGroup: false },
      '2': { name: 'Project Team', isGroup: true },
      '3': { name: 'Sarah Johnson', isGroup: false },
      '4': { name: 'Design Team', isGroup: true },
      '5': { name: 'Mike Chen', isGroup: false },
      '6': { name: 'Marketing Team', isGroup: true },
      '7': { name: 'Emily Rodriguez', isGroup: false },
      '8': { name: 'Weekend Plans', isGroup: true },
      '9': { name: 'Alex Kim', isGroup: false },
      '10': { name: 'Development Team', isGroup: true },
    };

    const conversationInfo = conversationNames[id] || { name: 'Unknown', isGroup: false };

    const mockConversation: Conversation = {
      id: id,
      name: conversationInfo.name,
      type: conversationInfo.isGroup ? ConversationType.GROUP : ConversationType.DIRECT,
      isGroup: conversationInfo.isGroup,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [
        {
          id: '1',
          userId: 'user1',
          conversationId: id,
          role: ConversationRole.MEMBER,
          joinedAt: new Date().toISOString(),
          isActive: true,
        }
      ]
    };

    setSelectedConversation(mockConversation);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    router.push(`/dashboard?id=${conversation.id}`);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Always visible */}
      <div className="w-full max-w-md border-r border-gray-200 bg-white">
        <ConversationList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={conversationId || undefined}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        {selectedConversation ? (
          <div className="h-full w-full bg-white">
            <ChatWindow conversation={selectedConversation} />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Select a conversation
            </h2>
            <p className="text-sm">
              Choose a conversation from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
