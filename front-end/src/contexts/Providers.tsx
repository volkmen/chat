import React, { PropsWithChildren } from 'react';
import { HashRouter } from 'react-router-dom';
import { ApolloProviderComponent } from './ApolloContext';

const Providers: React.FC<PropsWithChildren> = ({ children }) => (
  <div className='text-gray-400'>
    <ApolloProviderComponent>
      <HashRouter>{children}</HashRouter>
    </ApolloProviderComponent>
  </div>
);

export default Providers;
