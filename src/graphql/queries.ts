/* tslint:disable */
/* eslint-disable */
// this is an auto-generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      conversations {
        nextToken
      }
      sentMessages {
        nextToken
      }
    }
  }
`;

export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      id
      name
      description
      type
      isGroup
      avatar
      lastMessageAt
      createdAt
      updatedAt
      members {
        nextToken
      }
      messages {
        nextToken
      }
      typingUsers {
        nextToken
      }
    }
  }
`;

export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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

export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getConversationsForUser = /* GraphQL */ `
  query GetConversationsForUser($userId: ID!) {
    getConversationsForUser(userId: $userId) {
      id
      name
      description
      type
      isGroup
      avatar
      lastMessageAt
      createdAt
      updatedAt
      members {
        nextToken
      }
      messages {
        nextToken
      }
      typingUsers {
        nextToken
      }
    }
  }
`;

export const getMessagesForConversation = /* GraphQL */ `
  query GetMessagesForConversation(
    $conversationId: ID!
    $limit: Int
    $nextToken: String
  ) {
    getMessagesForConversation(
      conversationId: $conversationId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        reactions {
          nextToken
        }
        readReceipts {
          nextToken
        }
      }
      nextToken
    }
  }
`;