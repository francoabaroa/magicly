import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    questions: [Question]
    question (id: ID!): Question
  }
  type Question {
    id: ID!
    user: User!
    body: String!
    type: QuestionType!
    keywords: [String]
    status: QuestionStatus!
    urgent: Boolean
    createdAt: Date!
    updatedAt: Date!
  }
`;