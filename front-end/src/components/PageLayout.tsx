import React, { PropsWithChildren } from 'react';
import { Spinner } from 'flowbite-react';
import SidebarComponent from './SidebarComponent';
import SearchPeopleComponent from './search-people/SearchPeopleComponent';

interface PageLayoutProps extends PropsWithChildren {
  loading: boolean;
  error?: any;
}

const PageLayout: React.FC<PageLayoutProps> = ({ loading, children }) => (
  <div>
    <div className='flex justify-end sticky top-2 z-20'>
      <SearchPeopleComponent />
    </div>
    <div className='flex relative'>
      <SidebarComponent />
      <div className='w-full'>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <Spinner size='lg' />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  </div>
);

export default PageLayout;
