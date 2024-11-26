import React from 'react';
import PageLayout from 'components/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CHAT, GET_MESSAGES } from 'api/chats';
import { ChatMessagesResponse } from 'types/chats';
import SendMessage from 'components/send-message/SendMessage';
import { isNumber } from 'lodash';
import { PageRoutes } from 'consts/routes';
import Message from './Message';
import { ME_QUERY } from 'api/account';
import './Chat.scss';
import useCheckChatsPage from 'hooks/useCheckChatsPage';

const Chat = () => {
  const params = useParams();
  const navigate = useNavigate();

  useCheckChatsPage();

  const chatId = params.chatId && +params.chatId;

  if (!isNumber(chatId)) {
    console.warn('was navigated form chat page', params);
    navigate(PageRoutes.Home);

    return null;
  }

  const { data: dataMessages, refetch } = useQuery<ChatMessagesResponse>(GET_MESSAGES, {
    variables: {
      chatId
    }
  });

  const { data: chatData } = useQuery(GET_CHAT, { variables: { chatId } });
  const { data: meData } = useQuery(ME_QUERY);
  const messages = React.useMemo(() => dataMessages?.GetMessages || [], [dataMessages]);
  const isEmpty = messages.length === 0;

  const chat = chatData?.GetChat;
  const me = meData?.GetMe;

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
        <div>
          {chat &&
            messages.map(msg => (
              <Message key={msg.id} me={me} message={msg} correspondent={chat.correspondent} className='mb-2' />
            ))}
        </div>
      )}
      <div
        className='sticky bottom-0 w-full p-3 bg-gray-100 rounded-t-lg'
        style={{ boxShadow: '0px -3px 14px -6px rgba(0,0,0,0.45)' }}
      >
        <SendMessage chatId={chatId} onSendMessage={refetch} />
      </div>
      {/*</div>*/}
    </PageLayout>
  );
};

export default Chat;
