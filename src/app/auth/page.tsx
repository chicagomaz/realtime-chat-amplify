'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@/lib/amplify';

export default function AuthPage() {
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
          >
            {({ signOut, user }) => (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">
                  Welcome, {user?.signInDetails?.loginId || 'User'}!
                </h2>
                <button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </Authenticator>
        </div>
      </div>
    </div>
  );
}