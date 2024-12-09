import React, { useRef } from 'react';
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
  const messagesEndRef = useRef<any>(null);
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
  const lastMessageIsMine = me && messages?.length > 0 && messages[messages.length - 1].sender_id === me.id;

  React.useEffect(() => {
    if (data && !isFirstLoaded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    } else if (pageIsVeryBottom && lastMessageIsMine) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setIsFirstLoad(true);
    }
  }, [data, pageIsVeryBottom, lastMessageIsMine, isFirstLoaded]);

  return (
    <PageLayout loading={false} mainClassName='flex flex-col justify-between'>
      {/*<div className='h-full '>*/}
      {isEmpty ? (
        <>
          <div />
          <div className='absolute-centered text-centered'>
            <p className='text-center'>Kick off this chat :)</p>
            <p> Start typing and send a message</p>
          </div>
        </>
      ) : (
        <div className='overflow-auto'>
          {chat &&
            messages?.map(msg => (
              <Message key={msg.id} me={me} message={msg} correspondent={chat.correspondent} className='mb-2' />
            ))}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>
      )}
      <div
        className='sticky bottom-0 w-full p-3 bg-gray-100 rounded-t-lg'
        style={{ boxShadow: '0px -3px 14px -6px rgba(0,0,0,0.45)' }}
      >
        <SendMessage chatId={chatId} />
      </div>
    </PageLayout>
  );
};

export default Chat;
