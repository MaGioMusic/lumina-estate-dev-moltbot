/** Chat Types for Lumina Estate */

export type ChatRoomType = 'direct' | 'group' | 'support';

export interface ChatRoom {
  id: string;
  name: string;
  type: ChatRoomType;
  avatar: string | null;
  participantIds: string[];
  participantCount: number;
  lastMessage: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  } | null;
  unreadCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'system';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  type: MessageType;
  content: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  isEdited: boolean;
  editedAt: string | null;
  replyTo: string | null; // message ID
  createdAt: string;
}

export interface ChatParticipant {
  id: string;
  userId: string;
  name: string;
  avatar: string | null;
  role: 'admin' | 'member';
  isOnline: boolean;
  lastSeen: string | null;
  joinedAt: string;
}

// Form data types
export interface ChatMessageFormData {
  content: string;
  type: MessageType;
  file: File | null;
  replyTo: string | null;
}

export interface ChatRoomFormData {
  name: string;
  type: ChatRoomType;
  participantIds: string[];
}
