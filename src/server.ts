import * as path from 'node:path';
import { createServer, type Server } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { type YogaServerInstance } from 'graphql-yoga/typings/server';
import { DataSource as TypeormDatasource } from 'typeorm';

import AuthDataSource from './resolvers/auth/AuthDataSource';
import UsersDataSource from './resolvers/users/UsersDataSource';
import ChatsDataSource from './resolvers/chats/ChatDataSource';
import resolvers from './resolvers';
import EmailVerificationService from './services/emailer';
import JwtService from './services/jwtService';
import { Context } from './types/server';

class App {
  yoga: YogaServerInstance<unknown, unknown>;
  context: {
    dataSources: {
      auth: AuthDataSource;
      users: UsersDataSource;
      chats: ChatsDataSource;
    };
    emailVerificationService: EmailVerificationService;
    jwtService: JwtService;
  };
  server: Server;
  dbConnection: TypeormDatasource;

  jwtService = new JwtService();

  private async getTypeDefs() {
    const loadedFiles = await loadFiles(path.join(process.cwd(), 'src', 'schema.graphql'));

    return mergeTypeDefs(loadedFiles);
  }

  initContextServices(dbConnection: TypeormDatasource) {
    this.context = {
      emailVerificationService: new EmailVerificationService(),
      jwtService: this.jwtService,
      dataSources: {
        auth: new AuthDataSource(dbConnection),
        users: new UsersDataSource(dbConnection),
        chats: new ChatsDataSource(dbConnection)
      }
    };
  }

  async initServer() {
    const typeDefs = await this.getTypeDefs();
    this.yoga = createYoga<Context>({
      schema: createSchema<Context>({
        typeDefs,
        resolvers
      }),
      context: this.getContext,
      graphqlEndpoint: '/graphiql'
    });

    this.server = createServer(this.yoga);

    return this.yoga;
  }

  private getContext = async ({ request }: any) => {
    const tokenPayload = await this.context.jwtService.parsePayload(request);

    return {
      ...this.context,
      tokenPayload
    };
  };

  public listen(port: number) {
    this.server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
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
