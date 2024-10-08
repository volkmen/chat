import { makeExecutableSchema } from '@graphql-tools/schema';
import userTypeDefs from './users.typedefs';
import userResolvers from './users.resolver';

export default makeExecutableSchema({
  typeDefs: userTypeDefs,
  resolvers: userResolvers
});
