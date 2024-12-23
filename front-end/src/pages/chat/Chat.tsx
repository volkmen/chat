import React from 'react';
import { isNumber } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import PageLayout from 'components/PageLayout';
import SendMessage from 'components/send-message/SendMessage';
import Pagination from 'components/Pagination';
import { GET_CHAT } from 'api/chats';
import { PageRoutes } from 'consts/routes';
import Message from './Message';
import { ME_QUERY } from 'api/account';
import { useCheckChatsPage, useIsVisible, useGetMessages } from 'hooks';
import useGetTypingUsername from 'hooks/useGetTypingUsername';
import './Chat.scss';

const Chat = () => {
  const params = useParams();
  const navigate = useNavigate();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [isFirstLoaded, setIsFirstLoad] = React.useState(false);

  useCheckChatsPage();

  const chatId = params.chatId && (+params.chatId as number);

  const username = useGetTypingUsername(chatId as number);

  React.useEffect(() => {
    setIsFirstLoad(false);
    setLastElem(null);
  }, [chatId]);

  if (!isNumber(chatId)) {
    console.warn('was navigated form chat page', params);
    navigate(PageRoutes.Home);

    return null;
  }

  const { data, fetchMessages, loading } = useGetMessages({ chatId });

  const messages = data || [];
  const { data: chatData } = useQuery(GET_CHAT, { variables: { chatId } });
  const { data: meData } = useQuery(ME_QUERY);
  const isEmpty = messages.length === 0;

  const chat = chatData?.GetChat;
  const me = meData?.GetMe;

  const [lastElem, setLastElem] = React.useState<HTMLDivElement | null>(null);

  const onFetchMsg = React.useCallback(() => {
    verifyLastElem();
    fetchMessages();
  }, [fetchMessages]);

  React.useEffect(() => {
    if (!isFirstLoaded && data) {
      setIsFirstLoad(true);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (data && lastElem) {
      lastElem.scrollIntoView();
    } else if (messagesEndRef.current) {
      const lastMessageIsMine = me && messages?.length > 0 && messages[messages.length - 1].senderId === me.id;

      if (lastMessageIsMine) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        const { top } = messagesEndRef.current?.getBoundingClientRect();

        if (top < window.innerHeight - 26) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [data?.length, isFirstLoaded]);

  const verifyLastElem = React.useCallback(() => {
    const container = containerRef.current;

    const el: any = Array.from(container?.childNodes || []).find((node: any) => {
      const { bottom, top } = node.getBoundingClientRect();

      return bottom < window.innerHeight && top < window.innerHeight;
    });

    if (el) {
      setLastElem(el);
    }
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const onSendMessage = React.useCallback(() => {
    setLastElem(null);
  }, []);

  return (
    <PageLayout loading={false} mainClassName='flex flex-col justify-between border-r border-r-gray-200'>
      <Pagination callback={onFetchMsg} className='bg-blend-screen overflow-auto' loading={loading} isReversed>
        {isEmpty ? (
          <>
            <div />
            <div className='absolute-centered text-centered'>
              <p className='text-center'>Kick off this chat :)</p>
              <p> Start typing and send a message</p>
            </div>
          </>
        ) : (
          <div style={{ height: 'inherit' }} ref={containerRef} className='overflow-auto'>
            {chat &&
              messages?.map(msg => (
                <Message key={msg.id} me={me} message={msg} correspondent={chat.correspondent} className='mb-2' />
              ))}
            <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} style={{ height: '1px' }} className='mb-6' />
            {/*{true && <div className='sticky bottom-0 w-full '>{'username'}</div>}*/}
          </div>
        )}
      </Pagination>

      <div>
        {username && <div className='sticky bottom-0 w-full text-xs italic'>{username}'s typing...</div>}
        <div
          className='sticky bottom-0 w-full p-3 border-t border-t-gray-200 bg-gray-50'
          style={{ boxShadow: ' 0px -6px 12px -12px rgba(0, 0, 0, 0.45)' }}
        >
          <SendMessage chatId={chatId} onSendMessage={onSendMessage} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Chat;
