'use client';

import { Conversation } from '@/types';
import PresenceBadge from './PresenceBadge';

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
  isSelected?: boolean;
}

export default function ConversationCard({ conversation, onClick, isSelected }: ConversationCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getDisplayName = () => {
    if (conversation.isGroup) {
      return conversation.name || 'Group Chat';
    }
    return conversation.name || 'Direct Message';
  };

  const getLastMessage = () => {
    // This would come from the actual last message in the conversation
    return 'Last message preview...';
  };

  const getUnreadCount = () => {
    // This would come from actual unread count calculation
    return 2;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-gray-100' : ''
      }`}
    >
      <div className="relative mr-3">
        {conversation.avatar ? (
          <img
            src={conversation.avatar}
            alt={getDisplayName()}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {getDisplayName()[0]}
            </span>
          </div>
        )}
        
        {!conversation.isGroup && (
          <div className="absolute -bottom-1 -right-1">
            <PresenceBadge isOnline={true} size="sm" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {getDisplayName()}
          </h3>
          <span className="text-xs text-gray-500">
            {conversation.lastMessageAt && formatTime(conversation.lastMessageAt)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">
            {getLastMessage()}
          </p>
          
          {getUnreadCount() > 0 && (
            <span className="ml-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {getUnreadCount()}
            </span>
          )}
        </div>
        
        {conversation.isGroup && (
          <p className="text-xs text-gray-500 mt-1">
            {conversation.members?.length || 0} members
          </p>
        )}
      </div>
    </div>
  );
}