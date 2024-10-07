import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import { mergedSchema } from './api';

class App {
  private server: ApolloServer;

  constructor() {
    this.server = new ApolloServer({
      schema: mergedSchema
    });
  }

  public listen(port: number) {
    return startStandaloneServer(this.server, {
      listen: { port }
    }).then(() => {
      console.log(`Listening on port: ${port}`);
    });
  }
}

export default App;
