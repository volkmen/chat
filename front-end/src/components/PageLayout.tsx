import React, { PropsWithChildren } from 'react';
import { Spinner } from 'flowbite-react';
import Header from './Header';
import SidebarComponent from './SidebarComponent';

interface PageLayoutProps extends PropsWithChildren {
  loading: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ loading, children }) => (
  <div>
    <Header />

    <div className='flex'>
      <SidebarComponent />
      <div className='bg-gray-100 w-full'>
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
