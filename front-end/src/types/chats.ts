import { ApolloSuccessDataResponse } from './api';

export interface MessageType {
  content: string;
  id: number;
  createdAt: number;
  senderId: number;
  isRead: boolean;
}

export interface Chat {
  id: number;
  messages: MessageType[];
  correspondent: {
    id: number;
    username: string;
  };
}

export type ChatMessagesResponse = ApolloSuccessDataResponse<'GetMessages', MessageType[]>;
export type SubscriptionMessageReceive = { MessageReceived: MessageType };

export type GetChatsResponse = ApolloSuccessDataResponse<'GetChats', Chat[]>;
