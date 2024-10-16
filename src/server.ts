import * as path from 'node:path';
import { createServer, type Server } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { type YogaServerInstance } from 'graphql-yoga/typings/server';
import { DataSource as TypeormDatasource } from 'typeorm';
import { type IncomingMessage, type ServerResponse } from 'http';

import AccountDataSource from './resolvers/account/AccountDataSource';
import resolvers from './resolvers';
import EmailVerificationService from './services/emailer';
import JwtService from './services/jwtService';

class App {
  yoga: YogaServerInstance<unknown, unknown>;
  context: {
    dataSources: {
      account: AccountDataSource;
    };
    emailVerificationService: EmailVerificationService;
    jwtService: JwtService;
  };
  server: Server;

  private async getTypeDefs() {
    const loadedFiles = await loadFiles(path.join(process.cwd(), 'src', 'schema.graphql'));

    return mergeTypeDefs(loadedFiles);
  }

  initContextServices(dbConnection: TypeormDatasource) {
    this.context = {
      emailVerificationService: new EmailVerificationService(),
      jwtService: new JwtService(),
      dataSources: {
        account: new AccountDataSource(dbConnection)
      }
    };
  }

  async initServer() {
    const typeDefs = await this.getTypeDefs();
    this.yoga = createYoga({
      schema: createSchema({
        typeDefs,
        resolvers
      }),
      context: this.getContext,
      graphqlEndpoint: '/graphiql'
    });

    return this.yoga;
  }

  private getContext = ({ req, res }: { req: IncomingMessage; res: ServerResponse }) => {
    return this.context;
  };

  public async listen(port: number, dbConnection: TypeormDatasource) {
    this.initContextServices(dbConnection);

    this.server = createServer(this.yoga);
    this.server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  }

  private formatError = (err: Error) => {
    console.error('!!!!!!!!!!!!!!!!!', err);

    return err;
  };

  close() {
    return this.server.close();
  }
}

export default App;
