import React from 'react';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { GET_USERS_CHATS } from 'api/users';
import { GetUsersResponse, User } from 'types/users';
import Fuse from 'fuse.js';
import { ADD_CHAT } from 'api/chats';
import { showToastError, showToastSuccess } from 'services/toast';
import { Chat, GetChatsResponse } from 'types/chats';
import { PageRoutes } from '../../consts/routes';
import { useNavigate } from 'react-router-dom';

const fuseOptions = {
  isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ['username', 'email']
};

export type GetUsersChatsResponse = GetUsersResponse & GetChatsResponse;
type UserExtended = User & {
  chat?: Chat;
};

const extractUsers = (data?: GetUsersChatsResponse): UserExtended[] => {
  const users = data?.GetUsers || [];
  const chats = data?.GetChats || [];

  const chatsMap = chats?.reduce<Record<number, Chat>>((acc, chat) => {
    acc[chat.correspondent.id] = chat;

    return acc;
  }, {});

  return users.map(user => ({ ...user, chat: chatsMap[user.id] }));
};

interface SearchPeopleOverlayProps {
  searchPattern: string;
}

const SearchPeopleOverlay: React.FC<SearchPeopleOverlayProps> = ({ searchPattern }) => {
  const { data } = useSuspenseQuery<GetUsersChatsResponse>(GET_USERS_CHATS, {
    fetchPolicy: 'cache-and-network'
  });
  const users = React.useMemo(() => extractUsers(data), [data]);
  const [addChat] = useMutation(ADD_CHAT);
  const navigate = useNavigate();

  const filteredUsers = React.useMemo(() => {
    if (!users) {
      return [];
    }

    const fuse = new Fuse<UserExtended>(users, fuseOptions);

    return fuse.search(searchPattern);
  }, [searchPattern]);

  const onAddChat = (user: UserExtended) => () => {
    if (user.chat) {
      console.log(PageRoutes.Chat + `/${user.chat.id}`);
      navigate(PageRoutes.Chats + `/${user.chat.id}`);
    } else {
      addChat({
        variables: {
          receiverId: user.id
        }
      })
        .then(() => {
          showToastSuccess(`Chat was added successfully with ${user.username}`);
          navigate(PageRoutes.Users + `/${user.id}`);
        })
        .catch(() => {
          showToastError('Error adding chat');
        });
    }
  };

  return (
    <div className='w-80 px-0 overflow-hidden border border-gray-200 shadow-2xl rounded-xl bg-white'>
      <div className='py-2 ps-3 italic text-sm bg-gray-100'>Found {filteredUsers?.length} results...</div>
      <hr />
      <ul>
        {filteredUsers.map(({ item: user }) => (
          <li
            className='p-2 cursor-pointer hover:bg-gray-50 flex w-full justify-between items-center'
            key={user.id}
            onMouseDown={onAddChat(user)}
          >
            <div>{user.username}</div>
            <div className='flex gap-1 items-center'></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPeopleOverlay;
