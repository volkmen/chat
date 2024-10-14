import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as path from 'node:path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import resolvers from 'resolvers';
import { DataSource as TypeormDatasource } from 'typeorm';
import AccountDataSource from './resolvers/account/AccountDataSource';
import { type IncomingMessage, type ServerResponse } from 'http';

class App {
  private server: ApolloServer;
  dataSources: Record<'account', object>;

  private getTypeDefs() {
    const loadedFiles = loadFilesSync(path.join(process.cwd(), 'src', 'schema.graphql'));
    return mergeTypeDefs(loadedFiles);
  }

  constructor() {
    const typeDefs = this.getTypeDefs();
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: this.formatError
      // schema: mergedSchema
    });
  }

  private initDataSources(dbConnection: TypeormDatasource) {
    const accountDataSource = new AccountDataSource(dbConnection);

    this.dataSources = {
      account: accountDataSource
    };
  }

  private getContext({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
    return Promise.resolve().then(() => ({
      dataSources: this.dataSources
    }));
  }

  public async listen(port: number, dbConnection: TypeormDatasource) {
    this.initDataSources(dbConnection);

    return startStandaloneServer(this.server, {
      listen: { port },
      context: params => this.getContext(params)
    }).then(() => {
      console.log(`Listening on port: ${port}`);
    });
  }

  private formatError = (err: Error) => {
    console.error('!!!!!!!!!!!!!!!!!', err);

    return err;
  };
}

export default App;
