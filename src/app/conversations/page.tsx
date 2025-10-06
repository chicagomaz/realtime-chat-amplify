'use client';

import ConversationList from '@/components/ConversationList';
import '@/lib/amplify';

export default function ConversationsPage() {
  return (
    <div className="h-screen bg-gray-50">
      <ConversationList />
    </div>
  );
}
