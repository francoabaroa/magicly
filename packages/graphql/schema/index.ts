import { gql } from 'apollo-server-express';

import enums from '../enums/index';

import userSchema from './user';
import homeworkSchema from './homework';
import employeeSchema from './employee';
import listSchema from './list';
import listItemSchema from './listItem';
import productSchema from './product';
import serviceSchema from './service';
import questionSchema from './question';
import answerSchema from './answer';
import documentSchema from './document';
import attachmentSchema from './attachment';
import settingSchema from './setting';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  homeworkSchema,
  employeeSchema,
  listSchema,
  listItemSchema,
  productSchema,
  serviceSchema,
  questionSchema,
  answerSchema,
  documentSchema,
  attachmentSchema,
  settingSchema,
  enums,
]