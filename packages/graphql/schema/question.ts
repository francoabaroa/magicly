import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    questions: [Question]
    question (id: ID!): Question
  }
  type Question {
    id: ID!
    body: String!
    type: QuestionType!
    keywords: [String]
    status: QuestionStatus!
    notificationType: NotificationType!
    urgent: Boolean
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }
`;