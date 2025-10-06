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
      if (data.getUser) {
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

    return data.createUser;
  } catch (error) {
    console.error('Error getting or creating user:', error);
    throw error;
  }
}

// Get conversations for current user
export async function getUserConversations(userId: string) {
  try {
    const { data: members } = await client.models.ConversationMember.list({
      filter: { userId: { eq: userId }, isActive: { eq: true} }
    });

    if (!members) return [];

    // Get full conversation details for each membership
    const conversations = await Promise.all(
      members.map(async (member) => {
        if (!member.conversationId) return null;
        const { data: conversation } = await client.models.Conversation.get({
          id: member.conversationId
        });
        return conversation;
      })
    );

    return conversations.filter(c => c !== null);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

// Create a new conversation
export async function createConversation(
  currentUserId: string,
  recipientEmail: string,
  isGroup: boolean,
  groupName?: string
) {
  try {
    // Find recipient user
    const { data: users } = await client.models.User.list({
      filter: { email: { eq: recipientEmail } }
    });

    if (!users || users.length === 0) {
      throw new Error('Recipient user not found');
    }

    const recipientUser = users[0];

    // Create conversation
    const { data: conversation } = await client.models.Conversation.create({
      name: isGroup ? groupName : recipientUser.displayName,
      isGroup,
      lastMessageAt: new Date().toISOString(),
    });

    if (!conversation) {
      throw new Error('Failed to create conversation');
    }

    // Add current user as member
    await client.models.ConversationMember.create({
      userId: currentUserId,
      conversationId: conversation.id,
      role: 'ADMIN',
      joinedAt: new Date().toISOString(),
      isActive: true,
    });

    // Add recipient as member
    await client.models.ConversationMember.create({
      userId: recipientUser.id,
      conversationId: conversation.id,
      role: 'MEMBER',
      joinedAt: new Date().toISOString(),
      isActive: true,
    });

    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string) {
  try {
    const { data: messages } = await client.models.Message.list({
      filter: { conversationId: { eq: conversationId } },
      limit: 100
    });

    return messages || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Send a message
export async function sendMessage(
  conversationId: string,
  authorId: string,
  content: string,
  type: string = 'TEXT'
) {
  try {
    const { data: message } = await client.models.Message.create({
      conversationId,
      authorId,
      content,
      type,
      isEdited: false,
    });

    // Update conversation's lastMessageAt
    await client.models.Conversation.update({
      id: conversationId,
      lastMessageAt: new Date().toISOString(),
    });

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
