'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@/lib/amplify';

function AuthContent() {
  const router = useRouter();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    if (user) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, router]);

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

export default function AuthPage() {
  return (
    <Authenticator.Provider>
      <AuthContent />
    </Authenticator.Provider>
  );
}