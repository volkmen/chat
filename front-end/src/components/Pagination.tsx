import React from 'react';
import classNames from 'classnames';
import { throttle } from 'lodash';
import { Spinner } from 'flowbite-react';

interface PaginationProps {
  children: React.ReactNode;
  callback: () => void;
  isHorizontal?: boolean;
  loading?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ children, callback, isHorizontal, loading, className }) => {
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const refCb = React.useRef<(() => void) | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  console.log(refCb);

  React.useEffect(() => {
    refCb.current = throttle(callback, 100);
  }, [callback]);

  React.useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio > 0) {
          refCb.current?.();
        }
      });

      observer.observe(ref.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, []);

  return (
    <div className={classNames(isHorizontal ? 'flex overflow-x-auto w-full pagination' : 'flex-column', className)}>
      {children}
      <div ref={ref} className='invisible'>
        a
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default Pagination;
