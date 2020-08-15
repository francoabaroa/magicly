import schema from './schema/index';
import resolvers from './resolvers/index';

const apolloServerConfig = {
  //TODO: remove introspection and playground eventually
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  context: {},
};

export default apolloServerConfig;