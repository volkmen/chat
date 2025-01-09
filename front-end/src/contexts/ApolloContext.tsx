import React, { PropsWithChildren } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const hostIp = process.env.HOST_IP || 'localhost:4000';
const httpLink = createHttpLink({
  uri: `http://${hostIp}/graphql`
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${hostIp}/graphql`,
    lazy: true,
    connectionParams: async () => {
      const token = localStorage.getItem('token');

      return { Authorization: token ? `Bearer ${token}` : '', connectionType: 'WS' };
    }
  })
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export const ApolloProviderComponent: React.FC<PropsWithChildren> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
