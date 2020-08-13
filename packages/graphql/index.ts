import schema from './schema/index';
import resolvers from './resolvers/index';

const apolloServerConfig = {
  typeDefs: schema,
  resolvers,
  context: {},
};

export default apolloServerConfig;