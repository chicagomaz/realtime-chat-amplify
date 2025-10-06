/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
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

export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onUpdateMessage(filter: $filter) {
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

export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
    onDeleteMessage(filter: $filter) {
      id
      conversationId
      authorId
      content
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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

export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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

export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation($filter: ModelSubscriptionConversationFilterInput) {
    onCreateConversation(filter: $filter) {
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

export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation($filter: ModelSubscriptionConversationFilterInput) {
    onUpdateConversation(filter: $filter) {
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
