import { gql } from '@apollo/client';

export const GET_CHATS = gql`
  query GetChats($includeCorrespondent: Boolean = false) {
    GetChats {
      id
      correspondent @include(if: $includeCorrespondent) {
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

export const ON_TYPING = gql`
  subscription OnTyping($chatId: ID!) {
    OnTyping(chatId: $chatId) {
      isTyping
      username
      userId
    }
  }
`;
