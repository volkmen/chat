import { ApolloSuccessDataResponse } from './api';
import { Paginated } from './pagination';

type User = {
  id: number;
  username: string;
};

export interface MessageType {
  content: string;
  id: number;
  createdAt: number;
  owner: Partial<User>;
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

export type GetMessagesResponse = ApolloSuccessDataResponse<'GetMessages', Paginated<MessageType>>;
export type SubscriptionMessageReceive = { MessageReceived: MessageType };
export type SubscriptionMessageIsRead = { MessageIsRead: MessageType };

export type GetChatsResponse = ApolloSuccessDataResponse<'GetChats', Chat[]>;
