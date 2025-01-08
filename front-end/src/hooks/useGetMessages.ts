import React from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_MESSAGES, MESSAGE_FRAGMENT, SUBSCRIBE_MESSAGE_IS_READ, SUBSCRIBE_TO_RECEIVE_MESSAGE } from 'api/messages';
import { GetMessagesResponse, MessageType, SubscriptionMessageIsRead, SubscriptionMessageReceive } from 'types/chats';
import { uniqBy } from 'lodash';

export default function useGetMessages({ chatId }: { chatId: number }) {
  const {
    data: dataMessages,
    loading,
    error,
    fetchMore
  } = useQuery<GetMessagesResponse>(GET_MESSAGES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      chatId,
      page: 1,
      size: 30
    }
  });

  const ref = React.useRef<any>(null);

  ref.current = dataMessages;

  const fetchNextPage = React.useCallback(() => {
    const responseData = ref.current?.GetMessages;

    if (responseData && responseData.page * responseData.size < responseData.total) {
      fetchMore<GetMessagesResponse>({
        variables: {
          chatId,
          page: responseData.page + 1,
          size: 30
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          const prevMessages = previousResult.GetMessages.data;
          const newMessages = fetchMoreResult.GetMessages.data;

          return {
            ...previousResult,
            GetMessages: {
              ...fetchMoreResult.GetMessages,
              data: uniqBy([...newMessages, ...prevMessages], 'id')
            }
          };
        }
      });
    }
  }, [chatId]);

  useSubscription<SubscriptionMessageIsRead>(SUBSCRIBE_MESSAGE_IS_READ, {
    onData: ({ data, client }) => {
      if (dataMessages) {
        client.cache.modify({
          fields: {
            GetMessages(existingMessages, { readField }) {
              return existingMessages.data.map((message: MessageType) => {
                if (readField('id', message) === data.data?.MessageIsRead.id) {
                  return client.cache.writeFragment({
                    data: data.data?.MessageIsRead,
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
          GetMessages(existingMessages: { data: { __ref: string }[] }, { readField }) {
            const newMessageData = newMessage.data?.['MessageReceived'];

            const isMessageExists = existingMessages.data.some(
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

              return {
                ...existingMessages,
                data: [...existingMessages.data, newMessageRef]
              };
            }

            return existingMessages;
          }
        }
      });
    }
  });

  return { data: dataMessages?.GetMessages.data, loading, error, fetchMessages: fetchNextPage };
}
