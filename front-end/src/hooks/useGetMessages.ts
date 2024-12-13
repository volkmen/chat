import { useQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGES, MESSAGE_FRAGMENT, SUBSCRIBE_TO_RECEIVE_MESSAGE } from 'api/messages';
import { ChatMessagesResponse, SubscriptionMessageReceive } from 'types/chats';

enum ChatEvents {
  MESSAGE_WAS_ADDED = 'MESSAGE_WAS_ADDED'
}

export default function useGetMessages({ chatId }: { chatId: number }) {
  const {
    data: dataMessages,
    loading,
    error
  } = useQuery<ChatMessagesResponse>(GET_MESSAGES, {
    variables: {
      chatId
    }
  });

  useSubscription<SubscriptionMessageReceive>(SUBSCRIBE_TO_RECEIVE_MESSAGE, {
    variables: { chatId },
    onData: ({ data: newMessage, client }) => {
      client.cache.modify({
        fields: {
          GetMessages(existingMessages = [], { readField }) {
            const newMessageData = newMessage.data?.['MessageReceived'];

            const isMessageExists = existingMessages.some(
              (messageRef: { __ref: string }) => readField('id', messageRef) === newMessageData?.id
            );

            if (isMessageExists) {
              return existingMessages;
            }

            if (newMessageData) {
              const newMessageRef = client.cache.writeFragment({
                data: newMessageData,
                fragment: MESSAGE_FRAGMENT
              });

              return [...existingMessages, newMessageRef];
            }

            return existingMessages;
          }
        }
      });
    }
  });

  return { data: dataMessages?.GetMessages, loading, error };
}
