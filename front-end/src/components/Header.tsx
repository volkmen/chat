import SearchPeopleComponent from './search-people/SearchPeopleComponent';
import React from 'react';
import { useQuery } from '@apollo/client';
import { ME_QUERY } from '../api/account';
import useGetScreenSize from '../hooks/useGetScreenSize';
import HamburgerIcon from './design-system/Hamburger';

// import AddUser from '../mocks/AddUser';
interface HeaderProps {
  onCollapse: () => void;
  isCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onCollapse, isCollapsed }) => {
  const { data } = useQuery(ME_QUERY);
  const { isSm } = useGetScreenSize();

  return (
    <div className='sticky z-20 bg-gray-100 top-0' style={{ boxShadow: '0 3px 3px -3px gray' }}>
      <div className='flex justify-between items-center p-2 md:container mx-auto'>
        <div className='ps-3 flex gap-x-2.5 items-center'>
          {!isSm && <HamburgerIcon onClick={onCollapse} isOpen={!isCollapsed} />}
          <div className='text-gray-800'>{data?.GetMe.username}</div>
          {/*<AddUser />*/}
        </div>
        <div className='flex items-center gap-3'>
          <SearchPeopleComponent />
        </div>
      </div>
    </div>
  );
};

export default Header;
