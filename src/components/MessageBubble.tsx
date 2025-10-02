'use client';

import { useState } from 'react';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onReaction: (emoji: string) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export default function MessageBubble({ message, isOwn, onReaction }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAttachment = () => {
    if (!message.attachmentUrl) return null;

    if (message.attachmentType === 'IMAGE') {
      return (
        <img
          src={message.attachmentUrl}
          alt="Attachment"
          className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(message.attachmentUrl, '_blank')}
        />
      );
    }

    if (message.attachmentType === 'PDF') {
      return (
        <div className="flex items-center p-3 bg-gray-100 rounded-lg max-w-xs">
          <div className="mr-3">
            <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              PDF Document
            </p>
            {message.attachmentSize && (
              <p className="text-xs text-gray-500">
                {(message.attachmentSize / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
          <button
            onClick={() => window.open(message.attachmentUrl, '_blank')}
            className="ml-2 text-primary-600 hover:text-primary-700 text-xs font-medium"
          >
            View
          </button>
        </div>
      );
    }

    return null;
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    const reactionCounts = message.reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => onReaction(emoji)}
            className="flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
          >
            <span className="mr-1">{emoji}</span>
            <span className="text-gray-600">{count}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && message.author && (
          <div className="flex items-center mb-1">
            {message.author.avatar ? (
              <img
                src={message.author.avatar}
                alt={message.author.displayName || message.author.username}
                className="h-6 w-6 rounded-full mr-2"
              />
            ) : (
              <div className="h-6 w-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {(message.author.displayName || message.author.username)[0]}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600 font-medium">
              {message.author.displayName || message.author.username}
            </span>
          </div>
        )}

        <div
          className={`relative group ${
            isOwn
              ? 'bg-primary-500 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          } rounded-lg px-4 py-2 break-words`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {message.content && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
          
          {renderAttachment()}

          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
              {formatTime(message.createdAt)}
              {message.isEdited && (
                <span className="ml-1 italic">(edited)</span>
              )}
            </span>
          </div>

          {/* Reaction picker */}
          {showReactions && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1 flex space-x-1 z-10">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReaction(emoji);
                    setShowReactions(false);
                  }}
                  className="hover:bg-gray-100 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {renderReactions()}

        {/* Read receipts */}
        {isOwn && message.readReceipts && message.readReceipts.length > 0 && (
          <div className="flex items-center justify-end mt-1">
            <span className="text-xs text-gray-500">
              Read by {message.readReceipts.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}