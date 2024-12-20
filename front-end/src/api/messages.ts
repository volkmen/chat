import { gql } from '@apollo/client';

export const MESSAGE_FRAGMENT = gql`
  fragment Message on Message {
    id
    content
    createdAt
    senderId
    isRead
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

export const DO_TYPING = gql`
  query DoTyping($chatId: ID!, $isTyping: Boolean!) {
    DoTyping(chatId: $chatId, isTyping: $isTyping)
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
  query GetMessages($chatId: ID!, $page: Int, $size: Int) {
    GetMessages(chatId: $chatId, page: $page, size: $size) {
      page
      size
      total
      data {
        ...Message
      }
    }
  }
`;

export const READ_MESSAGE = gql`
  mutation ReadMessage($id: ID!) {
    ReadMessage(id: $id)
  }
`;

export const SUBSCRIBE_MESSAGE_IS_READ = gql`
  ${MESSAGE_FRAGMENT}
  subscription MessageIsRead {
    MessageIsRead {
      ...Message
    }
  }
`;
