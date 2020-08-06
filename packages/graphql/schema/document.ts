import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    documents: [Document]
    document (id: ID!): Document
  }
  type Document {
    id: ID!
    user: User!
    type: DocType!
    tag: DocTag
    keywords: [String]
    name: String
    bucketDocId: Int!
    bucketName: String
    bucketPath: String
    docValue: Int
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }
`;