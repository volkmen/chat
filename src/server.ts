import * as path from 'node:path';
import { createServer, type Server } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import resolvers from './resolvers';
import { DataSource as TypeormDatasource } from 'typeorm';
import AccountDataSource from './resolvers/account/AccountDataSource';
import { type IncomingMessage, type ServerResponse } from 'http';
import { type YogaServerInstance } from 'graphql-yoga/typings/server';

class App {
  yoga: YogaServerInstance<object, object>;
  dataSources: Record<'account', object>;
  server: Server;

  private async getTypeDefs() {
    const loadedFiles = await loadFiles(path.join(process.cwd(), 'src', 'schema.graphql'));

    return mergeTypeDefs(loadedFiles);
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

  private initDataSources(dbConnection: TypeormDatasource) {
    const accountDataSource = new AccountDataSource(dbConnection);

    this.dataSources = {
      account: accountDataSource
    };
  }

  private getContext = ({ req, res }: { req: IncomingMessage; res: ServerResponse }) => {
    return {
      dataSources: this.dataSources
    };
  };

  public async listen(port: number, dbConnection: TypeormDatasource) {
    this.initDataSources(dbConnection);

    this.server = createServer(this.yoga);
    this.server.listen(port, () => {
      // console.log(`Server is listening on port ${port}`);
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
