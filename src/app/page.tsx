'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '@/lib/amplify';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthState();

    const hubListener = (data: any) => {
      switch (data.payload.event) {
        case 'signIn':
          setIsAuthenticated(true);
          router.push('/dashboard');
          break;
        case 'signOut':
          setIsAuthenticated(false);
          break;
      }
    };

    const unsubscribe = Hub.listen('auth', hubListener);

    return unsubscribe;
  }, [router]);

  const checkAuthState = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      router.replace('/dashboard');
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // This should never render because checkAuthState will redirect
    // But just in case, show a loading state
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Chat App
          </h1>
          <p className="text-gray-600">
            Connect and chat in real-time with friends and colleagues
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Authenticator
            variation="modal"
            signUpAttributes={['email']}
            hideSignUp={false}
          />
        </div>
      </div>
    </div>
  );
}