import * as path from 'node:path';
import { createServer, type Server } from 'node:http';
import { createSchema, createYoga, createPubSub } from 'graphql-yoga';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { type YogaServerInstance } from 'graphql-yoga/typings/server';
import { DataSource as TypeormDatasource } from 'typeorm';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import AuthDataSource from './resolvers/auth/AuthDataSource';
import UsersDataSource from './resolvers/users/UsersDataSource';
import ChatsDataSource from './resolvers/chats/ChatDataSource';
import MessagesDataSource from './resolvers/messages/MessagesDataSource';
import resolvers from './resolvers';
import EmailVerificationService from './services/emailer';
import JwtService from './services/jwtService';
import { Context } from './types/server';
import { ConnectionParams } from 'subscriptions-transport-ws';
import { CHAT_ADDED } from './resolvers/chats/events';

class App {
  yoga: YogaServerInstance<Context, Context>;
  context: Context;
  server: Server;
  dbConnection: TypeormDatasource;
  pubsub: ReturnType<typeof createPubSub>;

  jwtService = new JwtService();

  private async getTypeDefs() {
    const loadedFiles = await loadFiles(path.join(__dirname, 'schema.graphql'));

    return mergeTypeDefs(loadedFiles);
  }

  initContextServices(dbConnection: TypeormDatasource) {
    this.context = {
      emailVerificationService: new EmailVerificationService(),
      jwtService: this.jwtService,
      pubsub: this.pubsub,
      dataSources: {
        auth: new AuthDataSource(dbConnection),
        users: new UsersDataSource(dbConnection),
        chats: new ChatsDataSource(dbConnection),
        messages: new MessagesDataSource(dbConnection)
      },
      tokenPayload: null
    };
  }

  async initServer() {
    const typeDefs = await this.getTypeDefs();

    // Initialize PubSub for subscriptions
    this.pubsub = createPubSub();

    // Create Yoga instance with WebSocket support
    this.yoga = createYoga<Context>({
      schema: createSchema<Context>({
        typeDefs,
        resolvers
      }),
      context: this.getContext,
      graphqlEndpoint: '/graphql', // HTTP and WebSocket endpoint
      graphiql: {
        // Use WebSockets in GraphiQL
        subscriptionsProtocol: 'WS'
      },
      logging: true // Enable logging for easier debugging
    });

    // Use the Yoga instance with an HTTP server
    this.server = createServer(this.yoga);

    const wsServer = new WebSocketServer({
      server: this.server,
      path: this.yoga.graphqlEndpoint
    });

    useServer(
      {
        execute: (args: any) => args.rootValue.execute(args),
        subscribe: (args: any) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
          const { schema, execute, subscribe, contextFactory, parse, validate } = this.yoga.getEnveloped({
            ...ctx,
            req: ctx.extra.request,
            socket: ctx.extra.socket,
            params: msg.payload
          });

          const args = {
            schema,
            operationName: msg.payload.operationName,
            document: parse(msg.payload.query),
            variableValues: msg.payload.variables,
            contextValue: await contextFactory(),
            rootValue: {
              execute,
              subscribe
            }
          };

          const errors = validate(args.schema, args.document);
          if (errors.length) return errors;
          return args;
        }
      },
      wsServer
    );

    console.log('GraphQL Yoga server with WebSocket support initialized.');

    return this.yoga;
  }

  private getContext = async ({
    request,
    connectionParams
  }: {
    request: Request;
    connectionParams?: ConnectionParams;
  }) => {
    const tokenPayload = await this.context.jwtService.parsePayload(request, connectionParams);

    return {
      ...this.context,
      tokenPayload
    };
  };

  public listen(port: number) {
    this.server.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}/graphql`);
      console.log(`Subscriptions are available at ws://localhost:${port}/graphql`);
    });
  }

  public async initContext(dbConnection: TypeormDatasource) {
    this.initContextServices(dbConnection);
    this.dbConnection = dbConnection;
  }

  private formatError = (err: Error) => {
    return err;
  };

  close() {
    return this.server.close();
  }
}

export default App;
