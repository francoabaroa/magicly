import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import homeworkResolvers from './homework';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  homeworkResolvers,
];