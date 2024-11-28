import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats {
    GetChats {
      id
      correspondent {
        id
        username
      }
    }
  }
`;

export const GET_CHAT = gql`
  query GetChat($chatId: ID!) {
    GetChat(id: $chatId) {
      id
      correspondent {
        id
        username
      }
    }
  }
`;

export const ADD_CHAT = gql`
  mutation AddChat($receiverId: ID!) {
    AddChat(receiverId: $receiverId)
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($chatId: ID!) {
    GetMessages(chatId: $chatId) {
      id
      content
      created_at
      sender_id
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $content: String!) {
    AddMessage(chatId: $chatId, content: $content) {
      id
      content
      created_at
    }
  }
`;