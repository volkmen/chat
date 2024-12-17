import { useQuery, useSubscription } from '@apollo/client';
import { ON_TYPING } from '../api/chats';
import { ME_QUERY } from '../api/account';

export default function useGetTypingUsername(chatId?: number) {
  const { data: meData } = useQuery(ME_QUERY);

  const s = useSubscription(ON_TYPING, {
    variables: {
      chatId
    },
    fetchPolicy: 'network-only'
  });

  return s.data?.OnTyping.isTyping && meData?.GetMe.id !== s.data.OnTyping.userId && s.data.OnTyping.username;
}
