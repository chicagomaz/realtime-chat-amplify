/* tslint:disable */
/* eslint-disable */
// this is an auto-generated file. This will be overwritten

export const onMessageAdded = /* GraphQL */ `
  subscription OnMessageAdded($conversationId: ID!) {
    onMessageAdded(conversationId: $conversationId) {
      id
      content
      authorId
      conversationId
      type
      attachmentUrl
      attachmentType
      attachmentSize
      replyToId
      isEdited
      editedAt
      createdAt
      updatedAt
      author {
        id
        email
        username
        displayName
        avatar
        bio
        isOnline
        lastSeen
        createdAt
        updatedAt
      }
      conversation {
        id
        name
        description
        type
        isGroup
        avatar
        lastMessageAt
        createdAt
        updatedAt
      }
      replyTo {
        id
        content
        authorId
        conversationId
        type
        attachmentUrl
        attachmentType
        attachmentSize
        replyToId
        isEdited
        editedAt
        createdAt
        updatedAt
      }
      reactions {
        nextToken
      }
      readReceipts {
        nextToken
      }
    }
  }
`;

export const onMessageReactionAdded = /* GraphQL */ `
  subscription OnMessageReactionAdded($messageId: ID!) {
    onMessageReactionAdded(messageId: $messageId) {
      id
      messageId
      userId
      emoji
      createdAt
      message {
        id
        content
        authorId
        conversationId
        type
        attachmentUrl
        attachmentType
        attachmentSize
        replyToId
        isEdited
        editedAt
        createdAt
        updatedAt
      }
      user {
        id
        email
        username
        displayName
        avatar
        bio
        isOnline
        lastSeen
        createdAt
        updatedAt
      }
    }
  }
`;

export const onTypingUpdated = /* GraphQL */ `
  subscription OnTypingUpdated($conversationId: ID!) {
    onTypingUpdated(conversationId: $conversationId) {
      id
      conversationId
      userId
      isTyping
      updatedAt
      conversation {
        id
        name
        description
        type
        isGroup
        avatar
        lastMessageAt
        createdAt
        updatedAt
      }
      user {
        id
        email
        username
        displayName
        avatar
        bio
        isOnline
        lastSeen
        createdAt
        updatedAt
      }
    }
  }
`;

export const onUserPresenceUpdated = /* GraphQL */ `
  subscription OnUserPresenceUpdated($userId: ID!) {
    onUserPresenceUpdated(userId: $userId) {
      id
      email
      username
      displayName
      avatar
      bio
      isOnline
      lastSeen
      createdAt
      updatedAt
    }
  }
`;

export const onReadReceiptAdded = /* GraphQL */ `
  subscription OnReadReceiptAdded($messageId: ID!) {
    onReadReceiptAdded(messageId: $messageId) {
      id
      messageId
      userId
      readAt
      message {
        id
        content
        authorId
        conversationId
        type
        attachmentUrl
        attachmentType
        attachmentSize
        replyToId
        isEdited
        editedAt
        createdAt
        updatedAt
      }
      user {
        id
        email
        username
        displayName
        avatar
        bio
        isOnline
        lastSeen
        createdAt
        updatedAt
      }
    }
  }
`;