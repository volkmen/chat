import { gql } from '@apollo/client';

export const MESSAGE_FRAGMENT = gql`
  fragment Message on Message {
    id
    content
    createdAt
    senderId
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $content: String!) {
    AddMessage(chatId: $chatId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

export const SUBSCRIBE_TO_RECEIVE_MESSAGE = gql`
  ${MESSAGE_FRAGMENT}
  subscription MessageReceived($chatId: ID!) {
    MessageReceived(chatId: $chatId) {
      ...Message
    }
  }
`;

export const GET_MESSAGES = gql`
  ${MESSAGE_FRAGMENT}
  query GetMessages($chatId: ID!) {
    GetMessages(chatId: $chatId) {
      ...Message
    }
  }
`;

export const READ_MESSAGE = gql`
  mutation ReadMessage($id: ID!) {
    ReadMessage(id: $id)
  }
`;
