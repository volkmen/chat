import React, { useCallback } from 'react';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGES, MESSAGE_FRAGMENT, SUBSCRIBE_MESSAGE_IS_READ, SUBSCRIBE_TO_RECEIVE_MESSAGE } from 'api/messages';
import { ChatMessagesResponse, SubscriptionMessageReceive } from 'types/chats';

export default function useGetMessages({ chatId }: { chatId: number }) {
  const [currentPage, setCurrentPage] = React.useState(0);

  const [fetchMessages, { data: dataMessages, loading, error }] = useLazyQuery<ChatMessagesResponse>(GET_MESSAGES, {
    fetchPolicy: 'cache-and-network',
    onData: () => {}
  });

  console.log(dataMessages, error);

  const fetchNextPage = useCallback(() => {
    console.log('fetch');

    const responseData = dataMessages?.GetMessages;
    const totalPages = responseData ? Math.ceil(responseData.total / responseData.size) : 0;

    if (!responseData || currentPage < totalPages) {
      fetchMessages({
        variables: {
          chatId,
          page: currentPage + 1,
          size: 30
        }
      });
    }
  }, [currentPage]);

  React.useEffect(() => {
    setCurrentPage(dataMessages?.GetMessages.page || 0);
  }, [dataMessages?.GetMessages.page]);

  useSubscription(SUBSCRIBE_MESSAGE_IS_READ, {
    onData: ({ data, client }) => {
      if (dataMessages) {
        client.cache.modify({
          fields: {
            GetMessages(existingMessages = [], { readField }) {
              return existingMessages.map((message: any) => {
                if (readField('id', message) === data.data.MessageIsRead.id) {
                  return client.cache.writeFragment({
                    data: data.data.MessageIsRead,
                    fragment: MESSAGE_FRAGMENT
                  });
                }

                return message;
              });
            }
          }
        });
      }
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

  return { data: dataMessages?.GetMessages.data, loading, error, fetchMessages: fetchNextPage };
}
