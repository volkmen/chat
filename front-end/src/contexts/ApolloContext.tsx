import React, { PropsWithChildren } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export const ApolloProviderComponent: React.FC<PropsWithChildren> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
