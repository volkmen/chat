import { makeExecutableSchema } from '@graphql-tools/schema';
import carsTypeDefs from './cars.typedefs';
import carResolvers from './cars.resolver';

export default makeExecutableSchema({
  typeDefs: carsTypeDefs,
  resolvers: carResolvers
});
