import React, { PropsWithChildren } from 'react';
import { Spinner } from 'flowbite-react';
import SidebarComponent from './SidebarComponent';

interface PageLayoutProps extends PropsWithChildren {
  loading: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ loading, children }) => (
  <div>
    <div className='flex'>
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
