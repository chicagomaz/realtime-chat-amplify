'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import ConversationList from '@/components/ConversationList';
import AuthPage from './auth/page';
import '@/lib/amplify';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthState();

    const hubListener = (data: any) => {
      switch (data.payload.event) {
        case 'signIn':
          setIsAuthenticated(true);
          break;
        case 'signOut':
          setIsAuthenticated(false);
          break;
      }
    };

    const unsubscribe = Hub.listen('auth', hubListener);

    return unsubscribe;
  }, []);

  const checkAuthState = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="h-screen bg-gray-50">
      <ConversationList />
    </div>
  );
}