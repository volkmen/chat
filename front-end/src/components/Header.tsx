import SearchPeopleComponent from './search-people/SearchPeopleComponent';
import React from 'react';
import { FcVoicePresentation } from 'react-icons/fc';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ME_QUERY } from '../api/account';

function Header() {
  const { loading, data, error } = useQuery(ME_QUERY);

  return (
    <div
      className='flex justify-between items-center sticky z-20 bg-cyan-50 top-0 p-2'
      style={{ boxShadow: '0 3px 3px -3px gray' }}
    >
      <div className='ps-3 flex gap-x-2.5 items-center'>
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' className='w-1/12' />
        <div className='text-gray-800'>{data?.GetMe.username}</div>
      </div>
      <SearchPeopleComponent />
    </div>
  );
}

export default Header;
