import SearchPeopleComponent from './search-people/SearchPeopleComponent';
import React from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../api/account';

function Header() {
  const { data } = useQuery(ME_QUERY);

  return (
    <div className='sticky z-20 bg-gray-100 top-0' style={{ boxShadow: '0 3px 3px -3px gray' }}>
      <div className='flex justify-between items-center p-2 container mx-auto'>
        <div className='ps-3 flex gap-x-2.5 items-center'>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' width='30px' />
          <div className='text-gray-800'>{data?.GetMe.username}</div>
        </div>
        <SearchPeopleComponent />
      </div>
    </div>
  );
}

export default Header;
