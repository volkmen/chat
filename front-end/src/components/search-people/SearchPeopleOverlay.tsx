import React from 'react';
import { useSuspenseQuery } from '@apollo/client';
import { GET_USERS } from 'api/users';
import { Card } from 'flowbite-react';
import { User } from 'types/users';
import Fuse from 'fuse.js';

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

const extractUsers = (data?: { GetUsers: Array<User> }) => data?.GetUsers;

interface SearchPeopleOverlayProps {
  searchPattern: string;
}

const SearchPeopleOverlay: React.FC<SearchPeopleOverlayProps> = ({ searchPattern }) => {
  const { data } = useSuspenseQuery<{ GetUsers: Array<User> }>(GET_USERS);
  const users = extractUsers(data);

  const filteredUsers = React.useMemo(() => {
    if (!users) {
      return [];
    }

    const fuse = new Fuse(users, fuseOptions);

    return fuse.search(searchPattern);
  }, [searchPattern]);

  return (
    <Card className='w-60'>
      <ul>
        {filteredUsers.map(({ item: user }) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </Card>
  );
};

export default SearchPeopleOverlay;
