import { ApolloServer, gql } from 'apollo-server-express';
import { GraphQLDateTime } from 'graphql-iso-date';

import schema from './schema/index';
import resolvers from './resolvers/index';

import users from './mockData/mockUserData';


//TODO: pass in DB models through the context to keep resolvers pure and update resolvers

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

export default server;