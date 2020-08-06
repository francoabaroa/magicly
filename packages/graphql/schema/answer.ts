import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    answers: [Answer]
    answer (id: ID!): Answer
  }
  type Answer {
    id: ID!
    user: User!
    employee: Employee!
    question: Question!
    attachment: Attachment!
    body: String
    keywords: [String]
    createdAt: Date!
    updatedAt: Date!
  }
`;