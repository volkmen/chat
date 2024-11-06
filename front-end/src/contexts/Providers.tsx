import React, { PropsWithChildren } from 'react';
import { HashRouter } from 'react-router-dom';
import { ApolloProviderComponent } from './ApolloContext';
import { ModalContextProvider } from './ModalContext';

const Providers: React.FC<PropsWithChildren> = ({ children }) => (
  <div className='text-gray-400'>
    <ApolloProviderComponent>
      <ModalContextProvider>
        <HashRouter>{children}</HashRouter>
      </ModalContextProvider>
    </ApolloProviderComponent>
  </div>
);

export default Providers;
