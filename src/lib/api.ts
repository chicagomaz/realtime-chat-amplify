import { generateClient } from 'aws-amplify/api';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

// Helper function to get or create user
export async function getOrCreateUser(email: string, userId: string) {
  try {
    // Try to get user by ID first
    try {
      const { data } = (await client.graphql({
        query: queries.getUser,
        variables: { id: userId }
      })) as any;
      if (data?.getUser) {
        return data.getUser;
      }
    } catch (e) {
      // User doesn't exist, will create below
    }

    // Create new user if doesn't exist
    const { data } = (await client.graphql({
      query: mutations.createUser,
      variables: {
        input: {
          id: userId,
          email,
          displayName: email.split('@')[0],
          isOnline: true,
        }
      }
    })) as any;

    return data?.createUser;
  } catch (error) {
    console.error('Error getting or creating user:', error);
    throw error;
  }
}

// Get conversations for current user
export async function getUserConversations(userId: string) {
  try {
    // Query ConversationMember records for this user to find their conversations
    const { data: memberData } = (await client.graphql({
      query: `
        query GetUserConversationMembers($userId: ID!) {
          listConversationMembers(filter: { userId: { eq: $userId }, isActive: { eq: true } }, limit: 100) {
            items {
              conversationId
              conversation {
                id
                name
                isGroup
                avatar
                lastMessageAt
                createdAt
                updatedAt
              }
            }
          }
        }
      `,
      variables: { userId }
    })) as any;

    const conversations = memberData?.listConversationMembers?.items
      ?.map((member: any) => member.conversation)
      ?.filter((conv: any) => conv != null) || [];

    return conversations;
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
    console.log('Creating conversation with:', { recipientEmail, isGroup, groupName });

    // First, find the recipient user by email
    const { data: userData } = (await client.graphql({
      query: queries.getUserByEmail,
      variables: { email: recipientEmail }
    })) as any;

    console.log('User lookup result:', userData);

    const recipientUser = userData?.getUserByEmail?.items?.[0];

    if (!recipientUser) {
      console.error('Recipient user not found for email:', recipientEmail);
      throw new Error('Recipient user not found. They must create an account first.');
    }

    console.log('Found recipient user:', recipientUser);

    // Create the conversation
    const conversationName = isGroup ? groupName : `Chat with ${recipientUser.displayName || recipientUser.email}`;

    console.log('Creating conversation with name:', conversationName);

    const { data: convData } = (await client.graphql({
      query: mutations.createConversation,
      variables: {
        input: {
          name: conversationName,
          isGroup: isGroup,
          lastMessageAt: new Date().toISOString()
        }
      }
    })) as any;

    console.log('Conversation creation result:', convData);

    const newConversation = convData?.createConversation;

    if (!newConversation) {
      console.error('Failed to create conversation - no data returned');
      throw new Error('Failed to create conversation');
    }

    console.log('Created conversation:', newConversation);

    // Get current user to add as member
    const { getCurrentUser } = await import('aws-amplify/auth');
    const currentUser = await getCurrentUser();

    console.log('Current user:', currentUser.userId);

    // Create conversation member entries for both users
    // Add current user as member
    console.log('Adding current user as member...');
    const currentMemberResult = await client.graphql({
      query: `
        mutation CreateConversationMember($input: CreateConversationMemberInput!) {
          createConversationMember(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          userId: currentUser.userId,
          conversationId: newConversation.id,
          role: 'MEMBER',
          joinedAt: new Date().toISOString(),
          isActive: true
        }
      }
    }) as any;
    console.log('Current user member created:', currentMemberResult);

    // Add recipient as member
    console.log('Adding recipient as member...');
    const recipientMemberResult = await client.graphql({
      query: `
        mutation CreateConversationMember($input: CreateConversationMemberInput!) {
          createConversationMember(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          userId: recipientUser.id,
          conversationId: newConversation.id,
          role: 'MEMBER',
          joinedAt: new Date().toISOString(),
          isActive: true
        }
      }
    }) as any;
    console.log('Recipient member created:', recipientMemberResult);

    console.log('Conversation creation complete!');
    return newConversation;
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    console.error('Error details:', {
      message: error.message,
      errors: error.errors,
      stack: error.stack
    });
    throw error;
  }
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string) {
  try {
    const { data } = (await client.graphql({
      query: queries.messagesByConversation,
      variables: {
        conversationId,
        limit: 100,
        sortDirection: 'ASC'
      }
    })) as any;

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
    const { data } = (await client.graphql({
      query: mutations.sendMessage,
      variables: {
        conversationId,
        content,
        type
      }
    })) as any;

    return data?.sendMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
