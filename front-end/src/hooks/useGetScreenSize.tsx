import React from 'react';
import { throttle } from 'lodash';

export default function useGetScreenSize() {
  const [sizes, setSizes] = React.useState({ isSm: false, isMd: false, isLg: false, isXl: false, is2xl: false });

  React.useEffect(() => {
    const cb = throttle(() => {
      setSizes({
        isSm: window.innerWidth >= 640,
        isMd: window.innerWidth >= 768,
        isLg: window.innerWidth >= 1024,
        isXl: window.innerWidth >= 1280,
        is2xl: window.innerWidth >= 1536
      });
    }, 50);

    window.addEventListener('resize', cb);

    return () => window.removeEventListener('resize', cb);
  }, []);

  return sizes;
}
