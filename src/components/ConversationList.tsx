'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import ConversationCard from './ConversationCard';
import { Conversation, ConversationType } from '@/types';
import { client } from '@/lib/amplify';
import { getCurrentUser } from 'aws-amplify/auth';

interface ConversationListProps {
  onSelectConversation?: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export default function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

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
      const now = new Date();
      const mockConversations: Conversation[] = [
        {
          id: '1',
          name: 'John Doe',
          type: ConversationType.DIRECT,
          isGroup: false,
          lastMessageAt: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 mins ago
          createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 5 * 60000).toISOString(),
        },
        {
          id: '2',
          name: 'Project Team',
          type: ConversationType.GROUP,
          isGroup: true,
          lastMessageAt: new Date(now.getTime() - 30 * 60000).toISOString(), // 30 mins ago
          createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 30 * 60000).toISOString(),
        },
        {
          id: '3',
          name: 'Sarah Johnson',
          type: ConversationType.DIRECT,
          isGroup: false,
          lastMessageAt: new Date(now.getTime() - 2 * 60 * 60000).toISOString(), // 2 hours ago
          createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 2 * 60 * 60000).toISOString(),
        },
        {
          id: '4',
          name: 'Design Team',
          type: ConversationType.GROUP,
          isGroup: true,
          lastMessageAt: new Date(now.getTime() - 5 * 60 * 60000).toISOString(), // 5 hours ago
          createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 5 * 60 * 60000).toISOString(),
        },
        {
          id: '5',
          name: 'Mike Chen',
          type: ConversationType.DIRECT,
          isGroup: false,
          lastMessageAt: new Date(now.getTime() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
          createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60000).toISOString(),
        },
        {
          id: '6',
          name: 'Marketing Team',
          type: ConversationType.GROUP,
          isGroup: true,
          lastMessageAt: new Date(now.getTime() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
          createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60000).toISOString(),
        },
        {
          id: '7',
          name: 'Emily Rodriguez',
          type: ConversationType.DIRECT,
          isGroup: false,
          lastMessageAt: new Date(now.getTime() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
          createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60000).toISOString(),
        },
        {
          id: '8',
          name: 'Weekend Plans',
          type: ConversationType.GROUP,
          isGroup: true,
          lastMessageAt: new Date(now.getTime() - 5 * 24 * 60 * 60000).toISOString(), // 5 days ago
          createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60000).toISOString(),
        },
        {
          id: '9',
          name: 'Alex Kim',
          type: ConversationType.DIRECT,
          isGroup: false,
          lastMessageAt: new Date(now.getTime() - 6 * 24 * 60 * 60000).toISOString(), // 6 days ago
          createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60000).toISOString(),
        },
        {
          id: '10',
          name: 'Development Team',
          type: ConversationType.GROUP,
          isGroup: true,
          lastMessageAt: new Date(now.getTime() - 8 * 24 * 60 * 60000).toISOString(), // 8 days ago
          createdAt: new Date(now.getTime() - 120 * 24 * 60 * 60000).toISOString(),
          updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60000).toISOString(),
        },
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleCreateConversation = () => {
    setShowNewMessageModal(true);
  };

  const handleCloseModal = () => {
    setShowNewMessageModal(false);
  };

  const handleCreateNewConversation = async (recipientEmail: string, isGroup: boolean, groupName?: string) => {
    // This would make an API call to create a new conversation
    // For now, we'll create a mock conversation
    const newConversation: Conversation = {
      id: String(conversations.length + 3),
      name: isGroup ? groupName : recipientEmail,
      type: isGroup ? ConversationType.GROUP : ConversationType.DIRECT,
      isGroup,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    };

    setConversations([newConversation, ...conversations]);
    setShowNewMessageModal(false);
    onSelectConversation?.(newConversation);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
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
                  onClick={() => onSelectConversation?.(conversation)}
                  isSelected={selectedConversationId === conversation.id}
                />
              ))}
            </div>
          )}
        </div>

      {/* New Message Modal */}
      {showNewMessageModal && <NewMessageModal onClose={handleCloseModal} onCreate={handleCreateNewConversation} />}
    </div>
  );
}

function NewMessageModal({ onClose, onCreate }: { onClose: () => void; onCreate: (email: string, isGroup: boolean, groupName?: string) => void }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGroup && !groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    if (!recipientEmail.trim()) {
      alert('Please enter a recipient email');
      return;
    }
    onCreate(recipientEmail, isGroup, groupName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">New Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isGroup}
                onChange={(e) => setIsGroup(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Create a group conversation</span>
            </label>
          </div>

          {isGroup && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isGroup ? 'Member Email' : 'Recipient Email'}
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}