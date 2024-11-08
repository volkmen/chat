import React, { PropsWithChildren } from 'react';
import { Spinner } from 'flowbite-react';
import SidebarComponent from './SidebarComponent';
import SearchPeopleComponent from './search-people/SearchPeopleComponent';
import Header from './Header';

interface PageLayoutProps extends PropsWithChildren {
  loading: boolean;
  error?: any;
}

const PageLayout: React.FC<PageLayoutProps> = ({ loading, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      const bounds = ref.current.getBoundingClientRect();

      setHeight(bounds.top);
    }
  }, []);

  return (
    <div>
      <Header />
      <div className='flex relative' ref={ref}>
        <SidebarComponent />
        <div className='w-full' style={{ height: `calc(100vh - ${height}px` }}>
          {loading ? (
            <div className='flex items-center justify-center'>
              <Spinner size='lg' />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
