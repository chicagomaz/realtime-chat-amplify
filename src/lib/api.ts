import { generateClient } from 'aws-amplify/api';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

// Helper function to get or create user
export async function getOrCreateUser(email: string, userId: string) {
  try {
    // Try to get user by ID first
    try {
      const { data } = await client.graphql({
        query: queries.getUser,
        variables: { id: userId }
      });
      if (data?.getUser) {
        return data.getUser;
      }
    } catch (e) {
      // User doesn't exist, will create below
    }

    // Create new user if doesn't exist
    const { data } = await client.graphql({
      query: mutations.createUser,
      variables: {
        input: {
          id: userId,
          email,
          displayName: email.split('@')[0],
          isOnline: true,
        }
      }
    });

    return data?.createUser;
  } catch (error) {
    console.error('Error getting or creating user:', error);
    throw error;
  }
}

// Get conversations for current user
export async function getUserConversations(userId: string) {
  try {
    const { data } = await client.graphql({
      query: queries.listConversations,
      variables: {
        limit: 100
      }
    });

    return data?.listConversations?.items || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

// Create a new conversation with a user by email
export async function createConversation(
  recipientEmail: string,
  isGroup: boolean,
  groupName?: string
) {
  try {
    // First, find the recipient user by email
    const { data: userData } = await client.graphql({
      query: queries.getUserByEmail,
      variables: { email: recipientEmail }
    });

    const recipientUser = userData?.getUserByEmail?.items?.[0];

    if (!recipientUser) {
      throw new Error('Recipient user not found. They must create an account first.');
    }

    // Create conversation using the appropriate mutation
    if (isGroup) {
      const { data } = await client.graphql({
        query: mutations.createGroupConversation,
        variables: {
          name: groupName,
          memberIds: [recipientUser.id]
        }
      });
      return data?.createGroupConversation;
    } else {
      const { data } = await client.graphql({
        query: mutations.createDirectConversation,
        variables: {
          recipientId: recipientUser.id
        }
      });
      return data?.createDirectConversation;
    }
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string) {
  try {
    const { data } = await client.graphql({
      query: queries.messagesByConversation,
      variables: {
        conversationId,
        limit: 100,
        sortDirection: 'ASC'
      }
    });

    return data?.messagesByConversation?.items || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Send a message
export async function sendMessageToConversation(
  conversationId: string,
  content: string,
  type: string = 'TEXT'
) {
  try {
    const { data } = await client.graphql({
      query: mutations.sendMessage,
      variables: {
        conversationId,
        content,
        type
      }
    });

    return data?.sendMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
