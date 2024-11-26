import React, { PropsWithChildren } from 'react';
import { Spinner } from 'flowbite-react';
import SidebarComponent from './SidebarComponent';
import Header from './Header';
import { throttle } from 'lodash';
import classNames from 'classnames';

interface PageLayoutProps extends PropsWithChildren {
  loading: boolean;
  error?: unknown;
  bottomPadding?: number;
  mainClassName?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ loading, children, mainClassName }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const cb = throttle(() => {
      if (ref.current) {
        const bounds = ref.current.getBoundingClientRect();

        setHeight(bounds.height);
      }
    }, 100);

    cb();
    window.addEventListener('resize', cb);

    return () => {
      window.removeEventListener('resize', cb);
    };
  }, []);

  return (
    <div>
      <div ref={ref}>
        <Header />
      </div>
      <div className='flex relative container mx-auto'>
        <SidebarComponent />
        <div
          className={classNames('w-full relative overflow-auto h-full scrollbar', mainClassName)}
          style={{ maxHeight: `calc(100vh - ${height}px`, minHeight: `calc(100vh - ${height}px)` }}
        >
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
