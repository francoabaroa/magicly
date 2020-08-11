import { ApolloServer, gql } from 'apollo-server-express';
import { GraphQLDateTime } from 'graphql-iso-date';

import schema from './schema/index';
import resolvers from './resolvers/index';

const apolloServerConfig = {
  typeDefs: schema,
  resolvers,
  context: {},
};

export default apolloServerConfig;