import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a User model with all the fields from Gen 1 schema.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      email: a.string().required(),
      username: a.string(),
      displayName: a.string(),
      avatar: a.string(),
      isOnline: a.boolean(),
      lastSeenAt: a.datetime(),
      // Relationships
      conversations: a.hasMany('ConversationMember', 'userId'),
      messages: a.hasMany('Message', 'authorId'),
    })
    .secondaryIndexes((index) => [index('email')])
    .authorization((allow) => [allow.authenticated()]),

  Conversation: a
    .model({
      name: a.string(),
      isGroup: a.boolean().required(),
      avatar: a.string(),
      lastMessageAt: a.datetime(),
      // Relationships
      members: a.hasMany('ConversationMember', 'conversationId'),
      messages: a.hasMany('Message', 'conversationId'),
    })
    .authorization((allow) => [allow.authenticated()]),

  ConversationMember: a
    .model({
      userId: a.id().required(),
      conversationId: a.id().required(),
      role: a.string(),
      joinedAt: a.datetime().required(),
      isActive: a.boolean(),
      lastReadAt: a.datetime(),
      // Relationships
      user: a.belongsTo('User', 'userId'),
      conversation: a.belongsTo('Conversation', 'conversationId'),
    })
    .secondaryIndexes((index) => [
      index('userId').sortKeys(['conversationId']),
      index('conversationId').sortKeys(['userId']),
    ])
    .authorization((allow) => [allow.authenticated()]),

  Message: a
    .model({
      conversationId: a.id().required(),
      authorId: a.id().required(),
      content: a.string().required(),
      type: a.string().required(),
      attachmentUrl: a.string(),
      attachmentType: a.string(),
      isEdited: a.boolean(),
      // Relationships
      author: a.belongsTo('User', 'authorId'),
      conversation: a.belongsTo('Conversation', 'conversationId'),
      reactions: a.hasMany('MessageReaction', 'messageId'),
      readReceipts: a.hasMany('ReadReceipt', 'messageId'),
    })
    .secondaryIndexes((index) => [
      index('conversationId').sortKeys(['createdAt']).queryField('messagesByConversation'),
      index('authorId').sortKeys(['createdAt']),
    ])
    .authorization((allow) => [allow.authenticated()]),

  MessageReaction: a
    .model({
      messageId: a.id().required(),
      userId: a.id().required(),
      emoji: a.string().required(),
      // Relationships
      message: a.belongsTo('Message', 'messageId'),
    })
    .secondaryIndexes((index) => [
      index('messageId').sortKeys(['createdAt']),
    ])
    .authorization((allow) => [allow.authenticated()]),

  ReadReceipt: a
    .model({
      messageId: a.id().required(),
      userId: a.id().required(),
      readAt: a.datetime().required(),
      // Relationships
      message: a.belongsTo('Message', 'messageId'),
    })
    .secondaryIndexes((index) => [
      index('messageId').sortKeys(['createdAt']),
    ])
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
