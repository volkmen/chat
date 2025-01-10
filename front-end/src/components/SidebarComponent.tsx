import React from 'react';
import { useQuery } from '@apollo/client';
import { Spinner } from 'flowbite-react';
import { GET_CHATS } from '../api/chats';
import { GetChatsResponse } from 'types/chats';
import { useNavigate, useParams } from 'react-router-dom';
import { PageRoutes } from '../consts/routes';
import classNames from 'classnames';

interface SidebarComponentProps {
  isCollapsed: boolean;
  closeSidebar: () => void;
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({ isCollapsed, closeSidebar }) => {
  const { data, loading } = useQuery<GetChatsResponse>(GET_CHATS, { variables: { includeCorrespondent: true } });
  const params = useParams();
  const selectedChatId = params.chatId && +params.chatId;
  const chats = data?.GetChats;

  const navigate = useNavigate();

  const onSelectChat = (chatId: number) => () => {
    closeSidebar();
    navigate(`${PageRoutes.Chats}/${chatId}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <aside
      id='default-sidebar'
      className={classNames(
        'w-64 transition-transform sm:translate-x-0 bg-gray-50 border-r border-gray-200 absolute sm:relative h-full sm:h-auto z-10',
        isCollapsed && '-translate-x-full'
      )}
      style={{ zIndex: 1 }}
      aria-label='Sidenav'
    >
      <div className='py-5 px-3 h-full dark:bg-gray-800 dark:border-gray-700 relative overflow-visible'>
        <ul className='overflow-y-auto'>
          {chats?.map(chat => (
            <li
              onClick={onSelectChat(chat.id)}
              key={chat.id}
              className={classNames(
                'flex items-center cursor-pointer p-1 text-sm w-full font-normal rounded-lg transition duration-75 group',
                selectedChatId === +chat.id ? 'text-cyan-600 underline' : 'text-gray-900'
              )}
            >
              {chat.correspondent.username}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarComponent;
