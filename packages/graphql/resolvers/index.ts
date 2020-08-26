import { GraphQLDateTime } from 'graphql-iso-date';

import answerResolvers from './answer';
import attachmentResolvers from './attachment';
import documentResolvers from './document';
import employeeResolvers from './employee';
import homeworkResolvers from './homework';
import listItemResolvers from './listItem';
import listResolvers from './list';
import productResolvers from './product';
import questionResolvers from './question';
import serviceResolvers from './service';
import settingResolvers from './setting';
import userResolvers from './user';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  answerResolvers,
  attachmentResolvers,
  documentResolvers,
  employeeResolvers,
  homeworkResolvers,
  listResolvers,
  listItemResolvers,
  productResolvers,
  questionResolvers,
  serviceResolvers,
  settingResolvers,
  userResolvers
];