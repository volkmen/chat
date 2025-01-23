import React, { PropsWithChildren } from 'react';
import { HashRouter } from 'react-router-dom';
import { ApolloProviderComponent } from './ApolloContext';
import { ModalContextProvider } from './ModalContext';
import S3ContextProvider from './S3Provider';

const Providers: React.FC<PropsWithChildren> = ({ children }) => (
  <div className='text-gray-400'>
    <ApolloProviderComponent>
      <ModalContextProvider>
        <S3ContextProvider>
          <HashRouter>{children}</HashRouter>
        </S3ContextProvider>
      </ModalContextProvider>
    </ApolloProviderComponent>
  </div>
);

export default Providers;
