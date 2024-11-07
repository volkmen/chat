import React, { PropsWithChildren } from 'react';
import { Spinner } from 'flowbite-react';
import SidebarComponent from './SidebarComponent';
import SearchComponent from './SearchComponent';

interface PageLayoutProps extends PropsWithChildren {
  loading: boolean;
  error?: any;
}

const PageLayout: React.FC<PageLayoutProps> = ({ loading, children }) => (
  <div>
    <div className='flex relative'>
      <SearchComponent />
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
