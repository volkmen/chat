import React, { PropsWithChildren } from 'react';
import { HashRouter } from 'react-router-dom';

const Providers: React.FC<PropsWithChildren> = ({ children }) => (
  <div className='text-gray-400'>
    <HashRouter>{children}</HashRouter>
  </div>
);

export default Providers;
