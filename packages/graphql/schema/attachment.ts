import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    attachments: [Attachment]
    attachment (id: ID!): Attachment
  }
  type Attachment {
    id: ID!
    user: User!
    name: String
    keywords: [String]
    bucketDocId: Int!
    bucketName: String
    bucketPath: String
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }
`;