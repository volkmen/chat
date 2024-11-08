import React, { Suspense } from 'react';
import { Spinner, TextInput } from 'flowbite-react';
import { MdOutlineSearch } from 'react-icons/md';
import classNames from 'classnames';
import DropdownPlaceholder from '../design-system/DropdownPlaceholder';
import SearchPeopleOverlay from './SearchPeopleOverlay';

const SearchPeopleComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const dropdownIsVisible = isFocused && searchValue.length > 0;

  const onBlur = () => {
    setSearchValue('');
    setIsFocused(false);
  };

  const overlay = (
    <Suspense fallback={<Spinner />}>
      <SearchPeopleOverlay searchPattern={searchValue} />
    </Suspense>
  );

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
        onBlur={onBlur}
        className={classNames(isFocused ? 'w-96' : 'w-48', 'transition-all')}
      />

      <DropdownPlaceholder placement='bottomLeft' visible={dropdownIsVisible} overlay={overlay} />
    </div>
  );
};

export default SearchPeopleComponent;
