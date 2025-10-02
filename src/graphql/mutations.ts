/* tslint:disable */
/* eslint-disable */
// this is an auto-generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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

export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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

export const createDirectConversation = /* GraphQL */ `
  mutation CreateDirectConversation($recipientId: ID!) {
    createDirectConversation(recipientId: $recipientId) {
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

export const createGroupConversation = /* GraphQL */ `
  mutation CreateGroupConversation($name: String!, $memberIds: [ID!]!) {
    createGroupConversation(name: $name, memberIds: $memberIds) {
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

export const sendMessage = /* GraphQL */ `
  mutation SendMessage(
    $conversationId: ID!
    $content: String
    $type: MessageType!
    $attachmentUrl: String
    $attachmentType: AttachmentType
    $replyToId: ID
  ) {
    sendMessage(
      conversationId: $conversationId
      content: $content
      type: $type
      attachmentUrl: $attachmentUrl
      attachmentType: $attachmentType
      replyToId: $replyToId
    ) {
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

export const addReaction = /* GraphQL */ `
  mutation AddReaction($messageId: ID!, $emoji: String!) {
    addReaction(messageId: $messageId, emoji: $emoji) {
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

export const removeReaction = /* GraphQL */ `
  mutation RemoveReaction($messageId: ID!, $emoji: String!) {
    removeReaction(messageId: $messageId, emoji: $emoji)
  }
`;

export const markMessageAsRead = /* GraphQL */ `
  mutation MarkMessageAsRead($messageId: ID!) {
    markMessageAsRead(messageId: $messageId) {
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

export const updateTypingStatus = /* GraphQL */ `
  mutation UpdateTypingStatus($conversationId: ID!, $isTyping: Boolean!) {
    updateTypingStatus(conversationId: $conversationId, isTyping: $isTyping) {
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

export const updateUserPresence = /* GraphQL */ `
  mutation UpdateUserPresence($isOnline: Boolean!) {
    updateUserPresence(isOnline: $isOnline) {
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

export const generatePresignedUploadUrl = /* GraphQL */ `
  mutation GeneratePresignedUploadUrl(
    $fileName: String!
    $fileType: String!
    $fileSize: Int!
  ) {
    generatePresignedUploadUrl(
      fileName: $fileName
      fileType: $fileType
      fileSize: $fileSize
    ) {
      uploadUrl
      downloadUrl
      key
    }
  }
`;