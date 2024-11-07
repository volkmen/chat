import React from 'react';
import { TextInput } from 'flowbite-react';

const SearchComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <div className='absolute right-0 bg-white  '>
      <TextInput
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        type='text'
        placeholder='Search people'
      />
    </div>
  );
};

export default SearchComponent;
