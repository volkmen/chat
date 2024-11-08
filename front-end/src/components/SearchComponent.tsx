import React from 'react';
import { TextInput } from 'flowbite-react';
import { MdOutlineSearch } from 'react-icons/md';
import { useLazyQuery } from '@apollo/client';
import { GET_USERS } from 'api/users';
import classNames from 'classnames';

const SearchComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [fetchUsers, { data: users }] = useLazyQuery(GET_USERS);

  return (
    <div className='relative hover:cursor-pointer'>
      {isFocused && (
        <div className={classNames('fixed top-0 left-0 w-full h-full bg-gray-400 opacity-70 transition-200')} />
      )}
      {!searchValue && <MdOutlineSearch size={20} className='absolute-centered-y z-20 left-2' />}
      <TextInput
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        type='text'
        placeholder='Search people'
        style={searchValue ? undefined : { textIndent: '20px' }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={classNames(isFocused ? 'w-96' : 'w-48', 'transition-all')}
      />
    </div>
  );
};

export default SearchComponent;
