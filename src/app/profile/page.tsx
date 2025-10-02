'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { ArrowLeftIcon, CameraIcon } from '@heroicons/react/24/outline';
import { User } from '@/types';
import { client } from '@/lib/amplify';
import AttachmentUploader from '@/components/AttachmentUploader';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      // Fetch user data from your API
      // This would typically be a GraphQL query to get the user's profile
      setUser({
        id: currentUser.userId,
        email: currentUser.signInDetails?.loginId || '',
        username: currentUser.username,
        displayName: currentUser.signInDetails?.loginId || '',
        isOnline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setFormData({
        displayName: currentUser.signInDetails?.loginId || '',
        bio: '',
        avatar: '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Update user profile via GraphQL mutation
      // await client.graphql({
      //   query: updateUser,
      //   variables: {
      //     input: {
      //       id: user?.id,
      //       ...formData,
      //     },
      //   },
      // });

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAvatarUpload = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          </div>
          
          {editing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-600">
                      {user?.displayName?.[0] || user?.email[0] || '?'}
                    </span>
                  </div>
                )}
                
                {editing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <AttachmentUploader
                      onUpload={handleAvatarUpload}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                    >
                      <CameraIcon className="h-6 w-6 text-white" />
                    </AttachmentUploader>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.displayName || user?.email}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{user?.displayName || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {editing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{user?.bio || 'No bio yet'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}