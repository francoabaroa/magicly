import schema from './schema/index';
import resolvers from './resolvers/index';

const apolloServerConfig = {
  //TODO: remove introspection and playground in PROD
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  context: {},
  cors: false,
};

export default apolloServerConfig;