import React from 'react';
import { useSuspenseQuery } from '@apollo/client';
import { GET_USERS } from 'api/users';
import { Card } from 'flowbite-react';
import { GetUsersResponse, User } from 'types/users';
import Fuse from 'fuse.js';
import { mockUsers } from '../../mocks/users';
import { BiMessageRounded, BiVideo } from 'react-icons/bi';

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

const extractUsers = (data?: GetUsersResponse) => data?.GetUsers;

interface SearchPeopleOverlayProps {
  searchPattern: string;
}

const SearchPeopleOverlay: React.FC<SearchPeopleOverlayProps> = ({ searchPattern }) => {
  const { data } = useSuspenseQuery<GetUsersResponse>(GET_USERS);
  const users = extractUsers(data);

  const filteredUsers = React.useMemo(() => {
    if (!users) {
      return [];
    }

    const fuse = new Fuse<User>(users, fuseOptions);

    return fuse.search(searchPattern);
  }, [searchPattern]);

  return (
    <div className='w-80 px-0 overflow-hidden border border-gray-200 shadow-2xl rounded-xl bg-white'>
      <div className='py-2 ps-3 italic text-sm bg-gray-100'>Found {filteredUsers?.length} results...</div>
      <hr />
      <ul>
        {filteredUsers.map(({ item: user }) => (
          <li className='p-2 cursor-pointer hover:bg-gray-50 flex w-full justify-between items-center' key={user.id}>
            <div>{user.username}</div>
            <div className='flex gap-1 items-center'>
              <BiMessageRounded size={20} className='hover:text-cyan-700 text-gray-500' />
              <BiVideo size={24} className='hover:text-cyan-700 text-gray-500' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPeopleOverlay;
