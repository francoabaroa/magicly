import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    answers: [Answer]
    answer (id: ID!): Answer
  }
  type Answer {
    id: ID!
    body: String!
    keywords: [String]
    createdAt: Date!
    updatedAt: Date!
    employee: Employee!
    question: Question!
    attachment: [Attachment]
  }
`;