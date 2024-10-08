import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import * as path from 'node:path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import resolvers from '../resolvers';

class App {
  private server: ApolloServer;

  private getTypeDefs() {
    const loadedFiles = loadFilesSync(path.join(process.cwd(), 'src', 'schema.graphql'));
    return mergeTypeDefs(loadedFiles);
  }

  constructor() {
    const typeDefs = this.getTypeDefs();
    this.server = new ApolloServer({
      typeDefs,
      resolvers
      // schema: mergedSchema
    });
  }

  public listen<T>(port: number, db: T) {
    return startStandaloneServer(this.server, {
      listen: { port },
      context: () => Promise.resolve({ db })
    }).then(() => {
      console.log(`Listening on port: ${port}`);
    });
  }
}

export default App;
