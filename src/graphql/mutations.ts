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

export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation(
    $input: UpdateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    updateConversation(input: $input, condition: $condition) {
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

export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation(
    $input: DeleteConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    deleteConversation(input: $input, condition: $condition) {
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

export const createConversationMember = /* GraphQL */ `
  mutation CreateConversationMember(
    $input: CreateConversationMemberInput!
    $condition: ModelConversationMemberConditionInput
  ) {
    createConversationMember(input: $input, condition: $condition) {
      id
      userId
      conversationId
      role
      joinedAt
      isActive
      lastReadAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updateConversationMember = /* GraphQL */ `
  mutation UpdateConversationMember(
    $input: UpdateConversationMemberInput!
    $condition: ModelConversationMemberConditionInput
  ) {
    updateConversationMember(input: $input, condition: $condition) {
      id
      userId
      conversationId
      role
      joinedAt
      isActive
      lastReadAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const deleteConversationMember = /* GraphQL */ `
  mutation DeleteConversationMember(
    $input: DeleteConversationMemberInput!
    $condition: ModelConversationMemberConditionInput
  ) {
    deleteConversationMember(input: $input, condition: $condition) {
      id
      userId
      conversationId
      role
      joinedAt
      isActive
      lastReadAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
