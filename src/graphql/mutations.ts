/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      isOnline
      lastSeenAt
      createdAt
      updatedAt
      __typename
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
      isOnline
      lastSeenAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      __typename
    }
  }
`;

export const createConversation = /* GraphQL */ `
  mutation CreateConversation(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConversation(input: $input, condition: $condition) {
      id
      name
      isGroup
      avatar
      lastMessageAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createDirectConversation = /* GraphQL */ `
  mutation CreateDirectConversation($recipientId: ID!) {
    createDirectConversation(recipientId: $recipientId) {
      id
      name
      isGroup
      avatar
      lastMessageAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createGroupConversation = /* GraphQL */ `
  mutation CreateGroupConversation($name: String!, $memberIds: [ID!]!) {
    createGroupConversation(name: $name, memberIds: $memberIds) {
      id
      name
      isGroup
      avatar
      lastMessageAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      conversationId
      authorId
      content
      type
      attachmentUrl
      attachmentType
      isEdited
      createdAt
      updatedAt
      author {
        id
        email
        displayName
        avatar
        __typename
      }
      __typename
    }
  }
`;

export const sendMessage = /* GraphQL */ `
  mutation SendMessage($conversationId: ID!, $content: String!, $type: String!) {
    sendMessage(conversationId: $conversationId, content: $content, type: $type) {
      id
      conversationId
      authorId
      content
      type
      attachmentUrl
      attachmentType
      isEdited
      createdAt
      updatedAt
      author {
        id
        email
        displayName
        avatar
        __typename
      }
      __typename
    }
  }
`;

export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      conversationId
      authorId
      content
      type
      attachmentUrl
      attachmentType
      isEdited
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      __typename
    }
  }
`;
