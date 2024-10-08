import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import { mergedSchema } from './api';
import { Connection } from 'mongoose';

class App {
  private server: ApolloServer;

  constructor() {
    this.server = new ApolloServer({
      schema: mergedSchema
    });
  }

  public listen(port: number, db: Connection) {
    return startStandaloneServer<any>(this.server, {
      listen: { port },
      context: ({ req, res }) => {
        return Promise.resolve(db);
      }
    }).then(() => {
      console.log(`Listening on port: ${port}`);
    });
  }
}

export default App;
