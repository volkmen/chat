import usersSchema from './users';
import carsSchema from './cars';
import { mergeSchemas } from '@graphql-tools/schema';

export const mergedSchema = mergeSchemas({
  schemas: [usersSchema, carsSchema]
});
