import React from 'react';
import PageLayout from 'components/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CHAT } from 'api/chats';
import SendMessage from 'components/send-message/SendMessage';
import { isNumber } from 'lodash';
import { PageRoutes } from 'consts/routes';
import Message from './Message';
import { ME_QUERY } from 'api/account';
import { useCheckChatsPage, useIsVisible, useGetMessages } from 'hooks';

import './Chat.scss';

const Chat = () => {
  const params = useParams();
  const navigate = useNavigate();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [isFirstLoaded, setIsFirstLoad] = React.useState(false);

  const pageIsVeryBottom = useIsVisible(messagesEndRef);

  useCheckChatsPage();

  const chatId = params.chatId && +params.chatId;

  React.useEffect(() => {
    setIsFirstLoad(false);
  }, [chatId]);

  if (!isNumber(chatId)) {
    console.warn('was navigated form chat page', params);
    navigate(PageRoutes.Home);

    return null;
  }

  const { data } = useGetMessages({ chatId });

  const messages = data || [];
  const { data: chatData } = useQuery(GET_CHAT, { variables: { chatId } });
  const { data: meData } = useQuery(ME_QUERY);
  const isEmpty = messages.length === 0;

  const chat = chatData?.GetChat;
  const me = meData?.GetMe;
  const lastMessageIsMine = me && messages?.length > 0 && messages[messages.length - 1].senderId === me.id;

  React.useEffect(() => {
    if (data && !isFirstLoaded) {
      messagesEndRef.current?.scrollIntoView();
      setIsFirstLoad(true);
    } else if (lastMessageIsMine || pageIsVeryBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages?.length, lastMessageIsMine, chatId]);

  return (
    <PageLayout loading={false} mainClassName='flex flex-col justify-between border-r  border-r-gray-200'>
      {isEmpty ? (
        <>
          <div />
          <div className='absolute-centered text-centered'>
            <p className='text-center'>Kick off this chat :)</p>
            <p> Start typing and send a message</p>
          </div>
        </>
      ) : (
        <div className='overflow-auto bg-blend-screen'>
          {chat &&
            messages?.map(msg => (
              <Message key={msg.id} me={me} message={msg} correspondent={chat.correspondent} className='mb-2' />
            ))}
          <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} style={{ height: '1px' }} className='mb-6' />
        </div>
      )}
      <div
        className='sticky bottom-0 w-full p-3 border-t border-t-gray-200 bg-gray-50'
        style={{ boxShadow: ' 0px -6px 12px -12px rgba(0, 0, 0, 0.45)' }}
      >
        <SendMessage chatId={chatId} />
      </div>
    </PageLayout>
  );
};

export default Chat;
