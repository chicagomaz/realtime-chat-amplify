export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  name?: string;
  description?: string;
  type: ConversationType;
  isGroup: boolean;
  avatar?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  members?: ConversationUser[];
  messages?: Message[];
  typingUsers?: TypingIndicator[];
}

export interface ConversationUser {
  id: string;
  userId: string;
  conversationId: string;
  role: ConversationRole;
  joinedAt: string;
  leftAt?: string;
  lastReadAt?: string;
  isActive: boolean;
  user?: User;
  conversation?: Conversation;
}

export interface Message {
  id: string;
  content?: string;
  authorId: string;
  conversationId: string;
  type: MessageType;
  attachmentUrl?: string;
  attachmentType?: AttachmentType;
  attachmentSize?: number;
  replyToId?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
  conversation?: Conversation;
  replyTo?: Message;
  reactions?: MessageReaction[];
  readReceipts?: ReadReceipt[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string;
  message?: Message;
  user?: User;
}

export interface ReadReceipt {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
  message?: Message;
  user?: User;
}

export interface TypingIndicator {
  id: string;
  conversationId: string;
  userId: string;
  isTyping: boolean;
  updatedAt: string;
  conversation?: Conversation;
  user?: User;
}

export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP'
}

export enum ConversationRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum MessageType {
  TEXT = 'TEXT',
  ATTACHMENT = 'ATTACHMENT',
  SYSTEM = 'SYSTEM'
}

export enum AttachmentType {
  IMAGE = 'IMAGE',
  PDF = 'PDF'
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  downloadUrl: string;
  key: string;
}