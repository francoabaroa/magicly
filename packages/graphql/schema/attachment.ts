import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    attachments: [Attachment]
    attachment (id: ID!): Attachment
  }
  type Attachment {
    id: ID!
    name: String
    keywords: [String]
    bucketDocId: String!
    bucketName: String!
    bucketPath: String
    notes: String
    createdAt: Date!
    updatedAt: Date!
    answer: Answer
    question: Question
  }
`;